import { jsPDF } from 'jspdf';
import { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (d: jsPDF, options: UserOptions) => void;
    }
}