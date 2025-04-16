import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para definir o tipo da venda
export interface ISale extends Document {
  operatorId: mongoose.Types.ObjectId;
  operatorRegistration: string;
  saleDate: Date;
  amount: number;
  transactionId?: string;
  product: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema para a coleção de vendas
const SaleSchema: Schema = new Schema(
  {
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: 'Operator',
      required: true,
    },
    operatorRegistration: {
      type: String,
      required: true,
      index: true,
    },
    saleDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionId: {
      type: String,
      required: false,
    },
    product: {
      type: String,
      required: true,
      default: 'Pix',
    },
  },
  {
    // Adiciona automaticamente campos createdAt e updatedAt
    timestamps: true,
  }
);

// Índices para melhorar o desempenho das consultas
SaleSchema.index({ operatorId: 1, saleDate: 1 });
SaleSchema.index({ operatorRegistration: 1 });
SaleSchema.index({ saleDate: 1 });

// Verificar se o modelo já foi compilado para evitar sobrescrever
const Sale: Model<ISale> = 
  mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);

export default Sale;
