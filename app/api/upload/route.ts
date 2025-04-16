import { NextRequest, NextResponse } from 'next/server';
import { processCSV } from '@/lib/csv-parser';

// Tamanho máximo do arquivo (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Processar formulário multipart
    const formData = await request.formData();
    const file = formData.get('csvFile') as File;
    
    // Verificar se o arquivo foi enviado
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }
    
    // Verificar o tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'O arquivo é muito grande. O tamanho máximo é 5MB' },
        { status: 400 }
      );
    }
    
    // Verificar o tipo do arquivo
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'O arquivo deve ser um CSV válido' },
        { status: 400 }
      );
    }
    
    // Ler o conteúdo do arquivo
    const fileContent = await file.text();
    
    // Processar o CSV
    const result = await processCSV(fileContent);
    
    // Adicionar mensagem de feedback sobre substituição de dados
    if (result.isReplacement) {
      result.message = 'Os dados anteriores foram substituídos pelos novos registros.';
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro ao processar upload:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar o arquivo CSV' },
      { status: 500 }
    );
  }
}
