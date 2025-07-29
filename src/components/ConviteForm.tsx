import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Heart, Sparkles, Gift, Users, Plus, Trash2, Baby } from "lucide-react";

interface CriancaData {
  nome: string;
  idade: number;
}

interface ConvidadoData {
  nome: string;
  tem_acompanhante: boolean;
  leva_crianca: boolean;
  qtd_acompanhantes: number;
  criancas?: CriancaData[];
}

const ConviteForm = () => {
  const [formData, setFormData] = useState<ConvidadoData>({
    nome: "",
    tem_acompanhante: false,
    leva_crianca: false,
    qtd_acompanhantes: 0,
    criancas: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();

  const adicionarCrianca = () => {
    setFormData({
      ...formData,
      criancas: [...(formData.criancas || []), { nome: "", idade: 0 }],
    });
  };

  const removerCrianca = (index: number) => {
    const novasCriancas = formData.criancas?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, criancas: novasCriancas });
  };

  const atualizarCrianca = (index: number, campo: keyof CriancaData, valor: string | number) => {
    const novasCriancas = [...(formData.criancas || [])];
    novasCriancas[index] = { ...novasCriancas[index], [campo]: valor };
    setFormData({ ...formData, criancas: novasCriancas });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Criar convidado
      const response = await fetch('apiinvite.lf.dev.br/convidados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const convidado = await response.json();
        
        // Confirmar presença automaticamente com crianças
        const confirmarResponse = await fetch(`apiinvite.lf.dev.br/convidados/${convidado.data.id}/confirmar`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            criancas: formData.criancas || [],
          }),
        });

        if (confirmarResponse.ok) {
          setIsConfirmed(true);
          toast({
            title: "🎉 Presença confirmada!",
            description: "Obrigado por confirmar! Mal podemos esperar para celebrar com você!",
          });
        }
      } else {
        throw new Error('Erro ao cadastrar convidado');
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

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-party flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-card border-0 shadow-party">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-button rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-white" />
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
                <span className="font-medium">{formData.nome}</span>
              </div>
              {formData.tem_acompanhante && (
                <div className="flex items-center justify-between">
                  <span>Acompanhantes:</span>
                  <span className="font-medium">{formData.qtd_acompanhantes}</span>
                </div>
              )}
              {formData.leva_crianca && formData.criancas && formData.criancas.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">Crianças:</span>
                  {formData.criancas.map((crianca, index) => (
                    <div key={index} className="text-xs flex justify-between ml-2">
                      <span>{crianca.nome}</span>
                      <span>{crianca.idade} anos</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <Card className="bg-gradient-card border-0 shadow-party">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-button rounded-full flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-button bg-clip-text text-transparent">
            Você está convidado!
          </CardTitle>
          <CardDescription className="text-base">
            Confirme sua presença para nossa festa especial
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
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="tem_acompanhante"
                checked={formData.tem_acompanhante}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    tem_acompanhante: checked as boolean,
                    qtd_acompanhantes: checked ? formData.qtd_acompanhantes : 0,
                  });
                }}
              />
              <Label htmlFor="tem_acompanhante" className="flex items-center gap-2 cursor-pointer">
                <Users className="w-4 h-4 text-primary" />
                Vou levar acompanhante(s)
              </Label>
            </div>

            {formData.tem_acompanhante && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="qtd_acompanhantes" className="text-sm font-medium">
                  Quantos acompanhantes?
                </Label>
                <Input
                  id="qtd_acompanhantes"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Ex: 2"
                  value={formData.qtd_acompanhantes || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    qtd_acompanhantes: parseInt(e.target.value) || 0 
                  })}
                  className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                />
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Checkbox
                id="leva_crianca"
                checked={formData.leva_crianca}
                onCheckedChange={(checked) => {
                  setFormData({ 
                    ...formData, 
                    leva_crianca: checked as boolean,
                    criancas: checked ? formData.criancas : [],
                  });
                }}
              />
              <Label htmlFor="leva_crianca" className="flex items-center gap-2 cursor-pointer">
                <Baby className="w-4 h-4 text-primary" />
                Vou levar criança(s)
              </Label>
            </div>

            {formData.leva_crianca && (
              <div className="ml-6 space-y-4">
                {(!formData.criancas || formData.criancas.length === 0) ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={adicionarCrianca}
                    className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/5"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar criança
                  </Button>
                ) : (
                  <>
                    <div className="space-y-3">
                      {formData.criancas?.map((crianca, index) => (
                    <div key={index} className="space-y-3 p-4 border border-border/50 rounded-lg bg-background/30">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-primary">
                          Criança {index + 1}
                        </Label>
                        {formData.criancas && formData.criancas.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removerCrianca(index)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Nome</Label>
                          <Input
                            type="text"
                            placeholder="Nome da criança"
                            value={crianca.nome}
                            onChange={(e) => atualizarCrianca(index, "nome", e.target.value)}
                            className="bg-background/50 border-border/50 focus:border-primary transition-colors text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Idade</Label>
                          <Input
                            type="number"
                            min="0"
                            max="17"
                            placeholder="0"
                            value={crianca.idade || ""}
                            onChange={(e) => atualizarCrianca(index, "idade", parseInt(e.target.value) || 0)}
                            className="bg-background/50 border-border/50 focus:border-primary transition-colors text-sm"
                          />
                        </div>
                      </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={adicionarCrianca}
                    className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/5"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar outra criança
                  </Button>
                </>
                )}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            variant="party" 
            className="w-full py-6 text-base"
            disabled={isLoading || !formData.nome.trim()}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Confirmando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Confirmar Presença
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default ConviteForm;