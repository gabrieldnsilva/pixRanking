import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Operator from '@/lib/models/operator';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Função para salvar a imagem do perfil
async function saveProfileImage(formData: FormData): Promise<string | null> {
  const file = formData.get('profileImage') as File;
  if (!file) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Criar nome de arquivo único
    const fileExt = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExt}`;
    
    // Garantir que o diretório existe
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Salvar o arquivo
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    
    // Retornar caminho relativo para o frontend
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    return null;
  }
}

// GET: Listar todas as operadoras
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Obter parâmetros de consulta (para paginação, ordenação, etc.)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Consultar operadoras com paginação
    const operators = await Operator.find({})
      .select('name registrationNumber profileImage createdAt')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await Operator.countDocuments({});
    
    return NextResponse.json({
      operators,
      pagination: {
        total,
        limit,
        skip,
        hasMore: total > skip + limit
      }
    });
  } catch (error) {
    console.error('Erro ao buscar operadoras:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar operadoras' },
      { status: 500 }
    );
  }
}

// POST: Criar uma nova operadora
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Processar formulário multipart
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const registrationNumber = formData.get('registrationNumber') as string;
    
    // Validar dados obrigatórios
    if (!name || !registrationNumber) {
      return NextResponse.json(
        { error: 'Nome e matrícula são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se já existe operadora com a mesma matrícula
    const existingOperator = await Operator.findOne({ registrationNumber });
    if (existingOperator) {
      return NextResponse.json(
        { error: 'Já existe uma operadora com esta matrícula' },
        { status: 409 }
      );
    }
    
    // Processar a imagem, se enviada
    let profileImage = null;
    if (formData.has('profileImage')) {
      profileImage = await saveProfileImage(formData);
    }
    
    // Criar a nova operadora
    const operator = new Operator({
      name,
      registrationNumber,
      profileImage
    });
    
    await operator.save();
    
    return NextResponse.json(operator, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar operadora:', error);
    return NextResponse.json(
      { error: 'Erro ao criar operadora' },
      { status: 500 }
    );
  }
}
