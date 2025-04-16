import mongoose from 'mongoose';

// Variáveis para gerenciar a conexão
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pixranking';

// Verificar se a variável de ambiente MONGODB_URI está configurada
if (!process.env.MONGODB_URI) {
  console.warn('Aviso: Variável de ambiente MONGODB_URI não encontrada. Usando conexão local padrão.');
}

// Objeto para controlar o estado da conexão
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Usando uma abordagem singleton para evitar múltiplas conexões
let cached: MongooseConnection = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Função para conectar ao MongoDB
 * Implementa um padrão singleton para evitar múltiplas conexões
 */
export async function connectToDatabase() {
  // Se já temos uma conexão, reuse-a
  if (cached.conn) {
    return cached.conn;
  }

  // Se não há uma promessa de conexão em andamento, crie uma
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Conectado ao MongoDB');
      return mongoose;
    });
  }

  try {
    // Espera a conexão ser estabelecida
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

/**
 * Função para desconectar do MongoDB
 * Útil para testes e encerramento da aplicação
 */
export async function disconnectFromDatabase() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('Desconectado do MongoDB');
  }
}
