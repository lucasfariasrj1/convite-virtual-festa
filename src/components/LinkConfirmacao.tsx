import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Send, Link } from "lucide-react";

interface LinkConfirmacaoProps {
  nomeConvidado: string;
}

const LinkConfirmacao = ({ nomeConvidado }: LinkConfirmacaoProps) => {
  const { toast } = useToast();
  const linkConfirmacao = `${window.location.origin}/confirmar?nome=${encodeURIComponent(nomeConvidado)}`;

  const copiarLink = () => {
    navigator.clipboard.writeText(linkConfirmacao);
    toast({
      title: "Link copiado!",
      description: "Link de confirmação foi copiado para a área de transferência",
    });
  };

  const enviarWhatsApp = () => {
    const mensagem = `Olá ${nomeConvidado}! 🎉\n\nVocê está convidado(a) para nossa festa! Para confirmar sua presença e informar os detalhes dos acompanhantes, acesse: ${linkConfirmacao}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          value={linkConfirmacao}
          readOnly
          className="bg-white/10 border-white/20 text-white text-xs"
        />
        <Button
          onClick={copiarLink}
          size="sm"
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          onClick={enviarWhatsApp}
          size="sm"
          variant="secondary"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LinkConfirmacao;