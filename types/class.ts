// Shared types for class scheduling and summary components

export type ClassPrices = {
  individual: {
    currency: string;
    price: number;
  };
  grupal: {
    currency: string;
    price: number;
  };
  especializada: {
    currency: string;
    price: number;
  };
}

export type SelectedClass = {
  date: string;
  hour: string;
  type: string;
}

// Shared class prices to be used across components
export const classPrices: ClassPrices = {
  individual: {
    currency: 'EUR',
    price: 16
  },
  grupal: {
    currency: 'EUR',
    price: 16
  },
  especializada: {
    currency: 'EUR',
    price: 16
  },
};

// Helper function to get class price
export const getClassPrice = (type: string): number => {
  switch(type) {
    case 'individual': return classPrices.individual.price;
    case 'grupal': return classPrices.grupal.price;
    case 'especializada': return classPrices.especializada.price;
    default: return 0;
  }
};

// Helper function to get class type name
export const getClassTypeName = (type: string): string => {
  switch(type) {
    case 'individual': return 'Individual';
    case 'grupal': return 'Grupal';
    case 'especializada': return 'Especializada';
    default: return type;
  }
};

// Helper function to get class type color
export const getClassTypeColor = (type: string): string => {
  switch(type) {
    case 'individual': return 'bg-blue-500';
    case 'grupal': return 'bg-green-500';
    case 'especializada': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};