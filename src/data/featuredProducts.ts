
export type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  imageUrl: string;
};

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Mansão Beira-Mar",
    price: "R$ 12.500.000",
    category: "Imóveis",
    imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 2,
    name: "Porsche 911 Turbo S",
    price: "R$ 1.850.000",
    category: "Automóveis",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 3,
    name: "Iate Azimut 80",
    price: "R$ 8.200.000",
    category: "Embarcações",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 4,
    name: "Rolex Daytona",
    price: "R$ 180.000",
    category: "Relógios",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: 5,
    name: "Escultura Exclusiva",
    price: "R$ 95.000",
    category: "Decoração",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600&h=400",
  }
];
