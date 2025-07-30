import ConviteForm from "@/components/ConviteForm";
// Usando a imagem enviada pelo usuário como plano de fundo
import { Sparkles, Heart, Gift } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Overlay para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black/20 z-5" />
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-secondary rounded-full blur-xl animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-accent rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-primary rounded-full blur-xl animate-pulse delay-2000" />
        <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-secondary rounded-full blur-lg animate-pulse delay-500" />
      </div>

      {/* Hero Image */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{ 
          backgroundImage: `url(/lovable-uploads/1adef081-bb19-4273-8b89-c693b0da143c.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        {/* <div className="text-center mb-8 max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
            <Gift className="w-8 h-8 text-accent animate-pulse" />
          </div>
          
        
          
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Heart className="w-5 h-5 text-primary" />
            <span>Confirme sua presença e faça parte dessa alegria</span>
            <Heart className="w-5 h-5 text-primary" />
          </div>
        </div> */}

        {/* Form */}
        <ConviteForm />
        

      </div>
    </div>
  );
};

export default Index;
