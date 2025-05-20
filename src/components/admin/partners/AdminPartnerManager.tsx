
import { Button } from "@/components/ui/button";
import PartnerForm from "./PartnerForm";
import PartnerList from "./PartnerList";
import { usePartnerManager } from "./usePartnerManager";

export default function AdminPartnerManager() {
  const {
    partners,
    form,
    editingId,
    showForm,
    loading,
    fetchError,
    setShowForm,
    setEditingId,
    setForm,
    handleInput,
    handleCancelForm,
    handleSave,
    handleEdit,
    handleDelete,
    move,
  } = usePartnerManager();

  return (
    <div className="bg-white rounded shadow-md py-5 px-6 max-w-2xl mx-auto my-8">
      <h2 className="font-bold font-playfair text-2xl mb-6 text-gold">
        Gerenciar Parceiros
      </h2>
      <div className="flex justify-end mb-4">
        <Button
          size="sm"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({
              name: "",
              description: "",
              banner_image_url: "",
              logo_url: "",
              link: "",
            });
          }}
          className="bg-gold hover:bg-gold/80 text-white"
        >
          Novo Parceiro
        </Button>
      </div>
      {fetchError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          Erro ao buscar parceiros: {fetchError}
        </div>
      )}
      {showForm && (
        <PartnerForm
          form={form}
          editingId={editingId}
          loading={loading}
          onChange={handleInput}
          onBannerChange={url => setForm(f => ({ ...f, banner_image_url: url }))}
          onLogoChange={url => setForm(f => ({ ...f, logo_url: url }))}
          onCancel={handleCancelForm}
          onSubmit={handleSave}
        />
      )}
      <div>
        <PartnerList
          partners={partners}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMove={move}
        />
      </div>
    </div>
  );
}
