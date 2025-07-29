import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, Sparkles, CheckCircle, Search } from "lucide-react";
import partyHero from "@/assets/party-hero.jpg";

const ConfirmarPresenca = () => {
  const [nome, setNome] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [convidadoData, setConvidadoData] = useState<any>(null);
  const { toast } = useToast();

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setIsLoading(true);

    try {
      // Buscar convidado pelo nome
      const response = await fetch('apiinvite.lf.dev.br/convidados');
      
      if (response.ok) {
        const result = await response.json();
        const convidados = result.data || [];
        const convidado = convidados.find((c: any) => 
          c.nome.toLowerCase().includes(nome.toLowerCase().trim())
        );

        if (convidado) {
          // Confirmar presença usando o ID do convidado
          const confirmarResponse = await fetch(`apiinvite.lf.dev.br/convidados/${convidado.id}/confirmar`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              criancas: [] // Por enquanto vazio, depois podemos adicionar interface para crianças
            })
          });

          if (confirmarResponse.ok) {
            setConvidadoData(convidado);
            setIsConfirmed(true);
            toast({
              title: "🎉 Presença confirmada!",
              description: "Obrigado por confirmar! Mal podemos esperar para celebrar com você!",
            });
          } else {
            throw new Error('Erro ao confirmar presença');
          }
        } else {
          toast({
            title: "Convidado não encontrado",
            description: "Verifique se digitou o nome corretamente ou entre em contato conosco.",
            variant: "destructive",
          });
        }
      } else {
        throw new Error('Erro ao buscar convidados');
      }
    } catch (error) {
      toast({
        title: "Ops! Algo deu errado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfirmed && convidadoData) {
    return (
      <div className="min-h-screen bg-gradient-party flex items-center justify-center p-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-secondary rounded-full blur-xl animate-pulse" />
          <div className="absolute top-32 right-20 w-16 h-16 bg-accent rounded-full blur-lg animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-primary rounded-full blur-xl animate-pulse delay-2000" />
        </div>

        {/* Hero Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${partyHero})` }}
        />

        <Card className="w-full max-w-md bg-gradient-card border-0 shadow-party relative z-10">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-button rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-button bg-clip-text text-transparent mb-2">
                Presença Confirmada!
              </h2>
              <p className="text-muted-foreground">
                Obrigado por confirmar! Será uma festa incrível!
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Nome:</span>
                <span className="font-medium">{convidadoData.nome}</span>
              </div>
              {convidadoData.tem_acompanhante && (
                <div className="flex items-center justify-between">
                  <span>Acompanhantes:</span>
                  <span className="font-medium">{convidadoData.qtd_acompanhantes}</span>
                </div>
              )}
              {convidadoData.leva_crianca && (
                <div className="flex items-center justify-between">
                  <span>Crianças:</span>
                  <span className="font-medium">Sim</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-party relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-secondary rounded-full blur-xl animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-accent rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-primary rounded-full blur-xl animate-pulse delay-2000" />
        <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-secondary rounded-full blur-lg animate-pulse delay-500" />
      </div>

      {/* Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${partyHero})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <div className="text-center mb-8 max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-button bg-clip-text text-transparent">
              Confirmar Presença
            </h1>
            <Heart className="w-8 h-8 text-accent animate-pulse" />
          </div>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-2 font-medium">
            Você já está na nossa lista de convidados!
          </p>
          
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Heart className="w-5 h-5 text-primary" />
            <span>Digite seu nome para confirmar sua presença</span>
            <Heart className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirmar} className="w-full max-w-md">
          <Card className="bg-gradient-card border-0 shadow-party">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-button rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-button bg-clip-text text-transparent">
                Encontrar meu convite
              </CardTitle>
              <CardDescription className="text-base">
                Digite seu nome para localizar e confirmar sua presença
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2 font-medium">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Seu nome
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                />
              </div>

              <Button 
                type="submit" 
                variant="party" 
                className="w-full py-6 text-base"
                disabled={isLoading || !nome.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Confirmando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Confirmar Presença
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>✨ Mal podemos esperar para celebrar com você! ✨</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarPresenca;