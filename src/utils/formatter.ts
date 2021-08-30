import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const formatter = (date: Date): string => {
  return format(date, 'd MMM yyyy', {
    locale: ptBR,
  });
};

export default formatter;
