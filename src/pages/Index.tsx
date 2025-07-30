import ConviteForm from "@/components/ConviteForm";
// Usando a imagem enviada pelo usuário como plano de fundo
import { Sparkles, Heart, Gift } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-rose-50/50">
      {/* Container centralizado */}
      <div className="container mx-auto min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center">
          
          {/* Imagem à esquerda */}
          <div className="order-2 lg:order-1">
            <img 
              src="/lovable-uploads/1adef081-bb19-4273-8b89-c693b0da143c.png"
              alt="Festa de aniversário"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          {/* Form à direita */}
          <div className="order-1 lg:order-2 flex flex-col items-center justify-center p-4">
            <ConviteForm />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Index;
