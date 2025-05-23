import Papa from 'papaparse';
import { connectToDatabase } from './db';
import Operator from './models/operator';
import Sale from './models/sale';
import mongoose from 'mongoose';

// Interface para a estrutura de dados do CSV
interface CSVRow {
  'Data Sitef': string;
  'Operador': string;
  'Produto': string;
  'Valor': string;
}

// Interface para a estrutura normalizada após processamento
interface ProcessedSale {
  saleDate: Date;
  operatorRegistration: string;
  product: string;
  amount: number;
  operatorId?: mongoose.Types.ObjectId;
}

/**
 * Processa o arquivo CSV e associa as vendas às operadoras cadastradas
 * @param fileContent Conteúdo do arquivo CSV
 * @returns Objeto com resultados do processamento
 */
export async function processCSV(fileContent: string) {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();

    // MODIFICAÇÃO: Remover todos os registros de vendas existentes
    await Sale.deleteMany({});
    console.log('Todos os registros de vendas anteriores foram removidos');

    // Processar o arquivo CSV utilizando PapaParse
    const result = Papa.parse<CSVRow>(fileContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      throw new Error(`Erro ao processar CSV: ${result.errors[0].message}`);
    }

    // Converter e normalizar os dados do CSV
    const processedData: ProcessedSale[] = [];
    
    // Obter todas as matrículas únicas para buscar operadoras em lote
    const registrationNumbers = Array.from(
      new Set(result.data.map(row => row['Operador'].trim()))
    );
    
    // Buscar todas as operadoras relevantes de uma vez
    const operators = await Operator.find({
      registrationNumber: { $in: registrationNumbers }
    });
    
    // Criar mapa para acesso rápido
    const operatorMap = new Map();
    operators.forEach(op => {
      operatorMap.set(op.registrationNumber, op);
    });
    
    for (const row of result.data) {
      // Extrair dados da linha do CSV
      const dateParts = row['Data Sitef'].split('-');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convertendo de DD-MM-AAAA para AAAA-MM-DD
      
      const operatorRegistration = row['Operador'].trim();
      const product = row['Produto'].trim();
      const amount = parseFloat(row['Valor'].replace(',', '.'));

      // Validar dados
      if (!operatorRegistration || isNaN(amount) || amount <= 0) {
        continue; // Pular linhas com dados inválidos
      }

      // Buscar a operadora pelo número de registro no mapa
      const operator = operatorMap.get(operatorRegistration);

      // Adicionar aos dados processados
      processedData.push({
        saleDate: new Date(formattedDate),
        operatorRegistration,
        product,
        amount,
        operatorId: operator?._id,
      });
    }

    // Operadoras não encontradas (registros que serão ignorados na importação)
    const unknownOperators = processedData
      .filter(sale => !sale.operatorId)
      .map(sale => sale.operatorRegistration)
      .filter((value, index, self) => self.indexOf(value) === index); // Remover duplicados

    // Registros válidos que serão importados
    const validSales = processedData.filter(sale => sale.operatorId);

    // Salvar os registros no banco de dados
    if (validSales.length > 0) {
      await Sale.insertMany(validSales);
    }

    return {
      success: true,
      totalProcessed: result.data.length,
      validRecords: validSales.length,
      ignoredRecords: result.data.length - validSales.length,
      unknownOperators: unknownOperators,
      processingDate: new Date(),
      isReplacement: true, // Nova flag para indicar que os dados anteriores foram substituídos
    };
  } catch (error) {
    console.error('Erro no processamento do CSV:', error);
    throw error;
  }
}

/**
 * Consulta as estatísticas de vendas por operadora com filtro opcional por período
 * @param options Opções de filtro como data inicial e final
 * @returns Array com estatísticas de vendas por operadora
 */
export async function getSalesStatistics(options: { 
  startDate?: Date; 
  endDate?: Date;
} = {}) {
  try {
    await connectToDatabase();

    // Construir o filtro para agregação
    const matchStage: any = {};
    
    if (options.startDate || options.endDate) {
      matchStage.saleDate = {};
      
      if (options.startDate) {
        matchStage.saleDate.$gte = options.startDate;
      }
      
      if (options.endDate) {
        matchStage.saleDate.$lte = options.endDate;
      }
    }

    // Agregar dados de vendas por operadora com filtro de data
    const salesByOperator = await Sale.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: '$operatorId',
          totalSales: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          operatorRegistration: { $first: '$operatorRegistration' }
        }
      },
      {
        $lookup: {
          from: 'operators',
          localField: '_id',
          foreignField: '_id',
          as: 'operator'
        }
      },
      {
        $unwind: '$operator'
      },
      {
        $project: {
          _id: 0,
          operatorId: '$_id',
          name: '$operator.name',
          registrationNumber: '$operator.registrationNumber',
          profileImage: '$operator.profileImage',
          salesCount: '$totalSales',
          totalAmount: '$totalAmount'
        }
      },
      {
        $sort: { salesCount: -1 }
      }
    ]);

    return salesByOperator;
  } catch (error) {
    console.error('Erro ao obter estatísticas de vendas:', error);
    throw error;
  }
}

/**
 * Obter as vendas recentes com dados do operador e filtro opcional por período
 * @param options Opções como limite de registros e filtro de data
 * @returns Lista de vendas
 */
export async function getRecentSales(options: {
  limit?: number;
  startDate?: Date;
  endDate?: Date;
} = {}) {
  try {
    await connectToDatabase();
    
    const { limit = 100 } = options;
    
    // Construir o filtro
    const matchStage: any = {};
    
    if (options.startDate || options.endDate) {
      matchStage.saleDate = {};
      
      if (options.startDate) {
        matchStage.saleDate.$gte = options.startDate;
      }
      
      if (options.endDate) {
        matchStage.saleDate.$lte = options.endDate;
      }
    }
    
    const recentSales = await Sale.aggregate([
      {
        $match: matchStage
      },
      {
        $sort: { saleDate: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'operators',
          localField: 'operatorId',
          foreignField: '_id',
          as: 'operator'
        }
      },
      {
        $unwind: '$operator'
      },
      {
        $project: {
          _id: 1,
          saleDate: 1,
          amount: 1,
          product: 1,
          operatorName: '$operator.name',
          operatorRegistration: 1,
          createdAt: 1
        }
      }
    ]);
    
    return recentSales;
  } catch (error) {
    console.error('Erro ao obter vendas recentes:', error);
    throw error;
  }
}
