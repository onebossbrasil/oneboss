
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, Phone } from "lucide-react";
import { useLeads } from "@/contexts/LeadContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const LeadsManager = () => {
  const { leads, updateLeadStatus, deleteLead, isLoading } = useLeads();
  const [filter, setFilter] = useState<string>("all");

  const filteredLeads = filter === "all"
    ? leads
    : leads.filter(lead => lead.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">Novo</Badge>;
      case "contacted":
        return <Badge className="bg-yellow-500">Contatado</Badge>;
      case "negotiating":
        return <Badge className="bg-purple-500">Negociando</Badge>;
      case "closed":
        return <Badge className="bg-green-500">Fechado</Badge>;
      case "lost":
        return <Badge className="bg-red-500">Perdido</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await updateLeadStatus(leadId, newStatus);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm("Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.")) {
      await deleteLead(leadId);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Gerenciamento de Leads</CardTitle>
        <CardDescription>
          Acompanhe e gerencie todos os leads recebidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="mr-2">Filtrar por:</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="contacted">Contatados</SelectItem>
                <SelectItem value="negotiating">Negociando</SelectItem>
                <SelectItem value="closed">Fechados</SelectItem>
                <SelectItem value="lost">Perdidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredLeads.length} leads encontrados
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-8">
            <p>Nenhum lead encontrado.</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {lead.message || "-"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value)}
                      >
                        <SelectTrigger className="h-8 w-[130px] pl-3 pr-2">
                          <SelectValue placeholder="Status">
                            {getStatusBadge(lead.status)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">
                            <Badge className="bg-blue-500">Novo</Badge>
                          </SelectItem>
                          <SelectItem value="contacted">
                            <Badge className="bg-yellow-500">Contatado</Badge>
                          </SelectItem>
                          <SelectItem value="negotiating">
                            <Badge className="bg-purple-500">Negociando</Badge>
                          </SelectItem>
                          <SelectItem value="closed">
                            <Badge className="bg-green-500">Fechado</Badge>
                          </SelectItem>
                          <SelectItem value="lost">
                            <Badge className="bg-red-500">Perdido</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLead(lead.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsManager;
