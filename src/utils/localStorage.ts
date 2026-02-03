import { LetterData } from '../types';

const STORAGE_KEY = 'generator_surat_pernyataan_history';

export interface HistoryItem {
    id: number;
    timestamp: string;
    label: string;
    data: LetterData;
}

export const saveHistory = (data: LetterData, label?: string): boolean => {
    try {
        const existing = getHistory();
        const newEntry: HistoryItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            label: label || `Surat Pernyataan - ${data.nama || 'Tanpa Nama'} (${new Date().toLocaleDateString()})`,
            data: data
        };
        const updated = [newEntry, ...existing];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage', error);
        return false;
    }
};

export const getHistory = (): HistoryItem[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading from localStorage', error);
        return [];
    }
};

export const deleteHistory = (id: number): boolean => {
    try {
        const existing = getHistory();
        const updated = existing.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error deleting from localStorage', error);
        return false;
    }
};
