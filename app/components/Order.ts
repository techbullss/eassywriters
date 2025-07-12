// types.ts
export type Order = {
  orderId: string;
  email: string;
  topic: string;
  instructions: string;
  level: string;
  assignmentType: string;
  style: string;
  pages: number;
  slides: number;
  spacing: string;
  wordCount: number;
  price: number;
  deadline: string;
  orderStatus: string;
  paymentstatus: string;
  amount: number;
  createdAt: string;
  fileUrls?:[];
};
