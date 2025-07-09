export interface Patient {
    id: string;
    name: string;
    cancerType: string;
    stage: string;
    status: 'Metastático' | 'Não-Metastático';
    additionalInfo?: string;
}

export const mockPatients: Patient[] = [
    {
        id: "104024",
        name: "DORALICE MARIA DA SILVA NASCIMENTO",
        cancerType: "Carcinoma Ductal Invasivo",
        stage: "Estágio IV",
        status: "Metastático",
        additionalInfo: "T2N2M1"
    },
    {
        id: "104024",
        name: "MARCIA REGINA GRZYBOWSKI",
        cancerType: "Carcinoma Ductal Invasivo",
        stage: "Estágio IIA",
        status: "Não-Metastático",
        additionalInfo: "T1CNOMO"
    },
    {
        id: "105627",
        name: "MARINA COSTA OLIVEIRA",
        cancerType: "Carcinoma Lobular Invasivo",
        stage: "Estágio IIIA",
        status: "Não-Metastático",
        additionalInfo: "T3N1M0"
    },
    {
        id: "106789",
        name: "CARLOS EDUARDO SANTOS",
        cancerType: "Carcinoma Ductal Invasivo",
        stage: "Estágio IV",
        status: "Metastático",
        additionalInfo: "T4N2M1"
    },
    {
        id: "107234",
        name: "PATRICIA ALMEIDA FERREIRA",
        cancerType: "Carcinoma Lobular Invasivo",
        stage: "Estágio IIB",
        status: "Não-Metastático",
        additionalInfo: "T2N1M0"
    }
];