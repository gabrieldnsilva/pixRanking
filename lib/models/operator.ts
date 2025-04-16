import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para definir o tipo da operadora
export interface IOperator extends Document {
  name: string;
  registrationNumber: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema para a coleção de operadoras
const OperatorSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Matrícula é obrigatória'],
      unique: true,
      trim: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
  },
  {
    // Adiciona automaticamente campos createdAt e updatedAt
    timestamps: true,
  }
);

// Índices para melhorar o desempenho das consultas
OperatorSchema.index({ registrationNumber: 1 }, { unique: true });
OperatorSchema.index({ name: 1 });

// Verificar se o modelo já foi compilado para evitar sobrescrever
const Operator: Model<IOperator> = 
  mongoose.models.Operator || mongoose.model<IOperator>('Operator', OperatorSchema);

export default Operator;
