export interface Batch{
    batchname: string;
    current: string;
    orientationdate?: Date;
    subject: string;
    startdate: Date;
    enddate?: Date;
    exams?: number;
    instructor1?: number;
    instructor2?: number;
    instructor3?: number;
    topicscovered?: string;
    topicsnotcovered?: string;
    courseid?: number;
}