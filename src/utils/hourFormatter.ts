import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const hourFormatter = (date: Date): string => {
  return format(date, 'hh mm', {
    locale: ptBR,
  });
};

export default hourFormatter;
