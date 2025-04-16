import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Operator from '@/lib/models/operator';
import Sale from '@/lib/models/sale';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

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

// Função para deletar arquivo de imagem
async function deleteProfileImage(imagePath: string) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  
  try {
    // Remover a parte inicial da URL para obter o caminho do sistema de arquivos
    const localPath = path.join(process.cwd(), 'public', imagePath);
    
    // Verificar se o arquivo existe antes de tentar excluí-lo
    if (existsSync(localPath)) {
      await unlink(localPath);
    }
  } catch (error) {
    console.error('Erro ao excluir imagem:', error);
  }
}

// GET: Obter uma operadora específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const operator = await Operator.findById(params.id);
    if (!operator) {
      return NextResponse.json(
        { error: 'Operadora não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(operator);
  } catch (error) {
    console.error('Erro ao buscar operadora:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar operadora' },
      { status: 500 }
    );
  }
}

// PUT: Atualizar uma operadora existente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Buscar a operadora existente
    const operator = await Operator.findById(params.id);
    if (!operator) {
      return NextResponse.json(
        { error: 'Operadora não encontrada' },
        { status: 404 }
      );
    }
    
    // Processar formulário multipart
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const registrationNumber = formData.get('registrationNumber') as string;
    const keepExistingImage = formData.get('keepExistingImage') === 'true';
    
    // Validar dados obrigatórios
    if (!name || !registrationNumber) {
      return NextResponse.json(
        { error: 'Nome e matrícula são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se a matrícula já existe em outra operadora
    const existingOperator = await Operator.findOne({ 
      registrationNumber, 
      _id: { $ne: params.id } 
    });
    
    if (existingOperator) {
      return NextResponse.json(
        { error: 'Já existe uma operadora com esta matrícula' },
        { status: 409 }
      );
    }
    
    // Atualizar campos básicos
    operator.name = name;
    operator.registrationNumber = registrationNumber;
    
    // Processar a imagem, se enviada
    if (formData.has('profileImage')) {
      // Excluir imagem anterior, se existir
      if (operator.profileImage) {
        await deleteProfileImage(operator.profileImage);
      }
      
      // Salvar a nova imagem
      const profileImage = await saveProfileImage(formData);
      operator.profileImage = profileImage;
    } else if (!keepExistingImage && operator.profileImage) {
      // Se não foi enviada nova imagem e não é para manter a existente, remover
      await deleteProfileImage(operator.profileImage);
      operator.profileImage = undefined;
    }
    
    // Salvar alterações
    await operator.save();
    
    return NextResponse.json(operator);
  } catch (error) {
    console.error('Erro ao atualizar operadora:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar operadora' },
      { status: 500 }
    );
  }
}

// DELETE: Excluir uma operadora
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Buscar a operadora
    const operator = await Operator.findById(params.id);
    if (!operator) {
      return NextResponse.json(
        { error: 'Operadora não encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar se há vendas associadas
    const salesCount = await Sale.countDocuments({ operatorId: params.id });
    if (salesCount > 0) {
      return NextResponse.json(
        { 
          error: 'Não é possível excluir a operadora porque existem vendas associadas',
          salesCount
        },
        { status: 409 }
      );
    }
    
    // Excluir a imagem se existir
    if (operator.profileImage) {
      await deleteProfileImage(operator.profileImage);
    }
    
    // Excluir a operadora
    await operator.deleteOne();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir operadora:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir operadora' },
      { status: 500 }
    );
  }
}
