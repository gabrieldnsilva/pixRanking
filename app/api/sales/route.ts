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
    
    // Obter total de vendas
    const totalSales = await Sale.countDocuments();
    const totalAmount = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const summary = {
      totalSales,
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0
    };
    
    // Retornar diferentes conjuntos de dados com base no modo
    if (mode === 'statistics') {
      const statistics = await getSalesStatistics();
      return NextResponse.json({ statistics, summary });
    } 
    else if (mode === 'recent') {
      const limit = parseInt(searchParams.get('limit') || '50');
      const recentSales = await getRecentSales(limit);
      return NextResponse.json({ recentSales, summary });
    }
    // Por padrão, retornar ambos
    else {
      const statistics = await getSalesStatistics();
      const recentSales = await getRecentSales(10);
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
