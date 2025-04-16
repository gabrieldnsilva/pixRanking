import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Sale from '@/lib/models/sale';
import { getRecentSales } from '@/lib/csv-parser';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    
    // Processar parâmetros de data
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    if (searchParams.has('startDate')) {
      startDate = new Date(searchParams.get('startDate') as string);
    }
    
    if (searchParams.has('endDate')) {
      // Ajustar endDate para incluir o fim do dia
      endDate = new Date(searchParams.get('endDate') as string);
      endDate.setHours(23, 59, 59, 999);
    }
    
    // Obter limite de registros (para relatórios grandes, limitar)
    const limit = parseInt(searchParams.get('limit') || '1000');
    
    // Filtros para consulta
    const filters = { startDate, endDate, limit };
    
    // Obter dados de vendas
    const sales = await getRecentSales(filters);
    
    // Condições para a contagem total e soma
    const countMatch: any = {};
    
    if (startDate || endDate) {
      countMatch.saleDate = {};
      if (startDate) countMatch.saleDate.$gte = startDate;
      if (endDate) countMatch.saleDate.$lte = endDate;
    }
    
    // Obter total de vendas com filtro
    const totalSales = await Sale.countDocuments(countMatch);
    const totalAmount = await Sale.aggregate([
      {
        $match: countMatch
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const summary = {
      totalSales,
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
      filteredByDate: !!(startDate || endDate),
      period: startDate || endDate ? {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      } : null
    };
    
    return NextResponse.json({ sales, summary });
  } catch (error) {
    console.error('Erro ao obter dados para relatório:', error);
    return NextResponse.json(
      { error: 'Erro ao obter dados para relatório' },
      { status: 500 }
    );
  }
}
