
import React from "react";

const AdminHeader = () => (
  <header className="w-full bg-white dark:bg-gray-900 px-8 py-5 border-b shadow-md fixed top-0 left-0 z-40">
    <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
      <h1 className="font-playfair text-2xl font-bold tracking-tight text-primary">
        Painel Administrativo <span className="text-gold ml-1">Premium</span>
      </h1>
      <div className="mt-2 sm:mt-0 text-muted-foreground text-sm font-medium">
        Bem-vindo(a) ao ambiente de gestão Oneboss!
      </div>
    </div>
  </header>
);

export default AdminHeader;

