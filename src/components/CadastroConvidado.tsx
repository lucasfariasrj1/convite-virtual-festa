import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Copy, Send } from "lucide-react";

interface CadastroConvidadoProps {
  onConvidadoCadastrado: () => void;
}

const CadastroConvidado = ({ onConvidadoCadastrado }: CadastroConvidadoProps) => {
  const [nome, setNome] = useState("");
  const [temAcompanhante, setTemAcompanhante] = useState(false);
  const [levaCrianca, setLevaCrianca] = useState(false);
  const [qtdAcompanhantes, setQtdAcompanhantes] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/convidados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.trim(),
          tem_acompanhante: temAcompanhante,
          leva_crianca: levaCrianca,
          qtd_acompanhantes: temAcompanhante ? qtdAcompanhantes : 0
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Sucesso",
          description: "Convidado cadastrado com sucesso!",
        });
        
        // Limpar formulário
        setNome("");
        setTemAcompanhante(false);
        setLevaCrianca(false);
        setQtdAcompanhantes(0);
        
        // Atualizar lista
        onConvidadoCadastrado();
        
        // Mostrar link de confirmação
        const linkConfirmacao = `${window.location.origin}/confirmar?nome=${encodeURIComponent(nome.trim())}`;
        navigator.clipboard.writeText(linkConfirmacao);
        
        toast({
          title: "Link copiado!",
          description: "Link de confirmação foi copiado para a área de transferência",
        });
        
      } else {
        throw new Error('Erro ao cadastrar convidado');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o convidado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Cadastrar Novo Convidado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-white">Nome do Convidado</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome completo"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="tem-acompanhante"
              checked={temAcompanhante}
              onCheckedChange={setTemAcompanhante}
            />
            <Label htmlFor="tem-acompanhante" className="text-white">
              Tem acompanhante
            </Label>
          </div>

          {temAcompanhante && (
            <div className="space-y-2">
              <Label htmlFor="qtd-acompanhantes" className="text-white">
                Quantidade de acompanhantes
              </Label>
              <Input
                id="qtd-acompanhantes"
                type="number"
                min="1"
                value={qtdAcompanhantes}
                onChange={(e) => setQtdAcompanhantes(parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="leva-crianca"
              checked={levaCrianca}
              onCheckedChange={setLevaCrianca}
            />
            <Label htmlFor="leva-crianca" className="text-white">
              Leva criança
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-primary hover:bg-white/90"
          >
            {loading ? "Cadastrando..." : "Cadastrar Convidado"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CadastroConvidado;