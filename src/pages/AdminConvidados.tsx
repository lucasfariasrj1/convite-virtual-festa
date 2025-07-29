import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, Baby, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Convidado {
  id: number;
  nome: string;
  tem_acompanhante: boolean;
  leva_crianca: boolean;
  qtd_acompanhantes: number;
  confirmado?: boolean;
  createdAt?: string;
  criancas?: Array<{
    id: number;
    nome: string;
    idade: number;
  }>;
}

const AdminConvidados = () => {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConvidados = async () => {
    try {
      const response = await fetch('http://localhost:3000/convidados');
      if (response.ok) {
        const result = await response.json();
        setConvidados(result.data || []);
      } else {
        throw new Error('Erro ao carregar convidados');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de convidados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvidados();
  }, []);

  const convidadosConfirmados = convidados.filter(c => c.confirmado);
  const totalPessoas = convidados.reduce((total, convidado) => {
    return total + 1 + (convidado.tem_acompanhante ? convidado.qtd_acompanhantes : 0);
  }, 0);
  const totalConfirmados = convidadosConfirmados.reduce((total, convidado) => {
    return total + 1 + (convidado.tem_acompanhante ? convidado.qtd_acompanhantes : 0);
  }, 0);

  const ConvidadoRow = ({ convidado }: { convidado: Convidado }) => (
    <TableRow>
      <TableCell className="font-medium">{convidado.nome}</TableCell>
      <TableCell>
        <Badge variant={convidado.confirmado ? "default" : "secondary"}>
          {convidado.confirmado ? "Confirmado" : "Pendente"}
        </Badge>
      </TableCell>
      <TableCell>{convidado.tem_acompanhante ? convidado.qtd_acompanhantes : 0}</TableCell>
      <TableCell>{convidado.leva_crianca ? <Baby className="h-4 w-4" /> : "-"}</TableCell>
      <TableCell>{1 + (convidado.tem_acompanhante ? convidado.qtd_acompanhantes : 0)}</TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-party flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-party p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <Heart className="h-16 w-16 mx-auto mb-4 text-white animate-pulse" />
          <h1 className="text-4xl font-bold text-white mb-2">
            Administração do Aniversário
          </h1>
          <p className="text-white/80">Gerencie sua lista de convidados</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total de Convidados</CardTitle>
              <Users className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{convidados.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Presenças Confirmadas</CardTitle>
              <UserCheck className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{convidadosConfirmados.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total de Pessoas</CardTitle>
              <Users className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalConfirmados} / {totalPessoas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabelas */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Lista de Convidados</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="todos" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="todos" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                  Todos ({convidados.length})
                </TabsTrigger>
                <TabsTrigger value="confirmados" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                  Confirmados ({convidadosConfirmados.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="todos" className="mt-6">
                <div className="rounded-md border border-white/20 bg-white/5">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20 hover:bg-white/5">
                        <TableHead className="text-white">Nome</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white">Acompanhantes</TableHead>
                        <TableHead className="text-white">Crianças</TableHead>
                        <TableHead className="text-white">Total Pessoas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {convidados.map((convidado) => (
                        <ConvidadoRow key={convidado.id} convidado={convidado} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="confirmados" className="mt-6">
                <div className="rounded-md border border-white/20 bg-white/5">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20 hover:bg-white/5">
                        <TableHead className="text-white">Nome</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white">Acompanhantes</TableHead>
                        <TableHead className="text-white">Crianças</TableHead>
                        <TableHead className="text-white">Total Pessoas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {convidadosConfirmados.map((convidado) => (
                        <ConvidadoRow key={convidado.id} convidado={convidado} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-center">
              <Button 
                onClick={fetchConvidados} 
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-white/90"
              >
                Atualizar Lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConvidados;