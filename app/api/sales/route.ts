import { NextRequest, NextResponse } from 'next/server';
import { getSalesStatistics, getRecentSales } from '@/lib/csv-parser';
import { connectToDatabase } from '@/lib/db';
import Sale from '@/lib/models/sale';

// GET: Obter estatísticas de vendas e/ou vendas recentes
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');
    
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
    
    // Filtros para agregação
    const filters = { startDate, endDate };
    
    // Condições para a contagem total
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
    
    // Retornar diferentes conjuntos de dados com base no modo
    if (mode === 'statistics') {
      const statistics = await getSalesStatistics(filters);
      return NextResponse.json({ statistics, summary });
    } 
    else if (mode === 'recent') {
      const limit = parseInt(searchParams.get('limit') || '50');
      const recentSales = await getRecentSales({ ...filters, limit });
      return NextResponse.json({ recentSales, summary });
    }
    // Por padrão, retornar ambos
    else {
      const statistics = await getSalesStatistics(filters);
      const recentSales = await getRecentSales({ ...filters, limit: 10 });
      return NextResponse.json({ statistics, recentSales, summary });
    }
  } catch (error) {
    console.error('Erro ao buscar dados de vendas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de vendas' },
      { status: 500 }
    );
  }
}
