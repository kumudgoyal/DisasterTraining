import prisma from '../config/database';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { notFound, badRequest } from '../utils/errors';
import { createPaginatedResponse } from '../utils/pagination';

export class ReportService {
  static async generate(userId: string, params: any) {
    const { title, reportType, format, filters } = params;

    const report = await prisma.report.create({
      data: {
        title,
        reportType,
        format,
        filters,
        filePath: '', 
        generatedBy: userId
      }
    });

    const storageDir = path.join(process.cwd(), 'storage', 'reports');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const extension = format.toLowerCase();
    const fileName = `${report.id}.${extension}`;
    const filePath = path.join(storageDir, fileName);

    if (format === 'PDF') {
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));
      doc.fontSize(20).text(title, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Generated At: ${new Date().toLocaleString()}`);
      doc.text(`Type: ${reportType}`);
      doc.end();
    } else if (format === 'EXCEL' || format === 'CSV') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Report');
      sheet.addRow(['Title', title]);
      sheet.addRow(['Date', new Date().toLocaleString()]);
      sheet.addRow(['Type', reportType]);
      
      if (format === 'EXCEL') {
        await workbook.xlsx.writeFile(filePath);
      } else {
        await workbook.csv.writeFile(filePath);
      }
    } else {
      throw badRequest('Unsupported format');
    }

    const updated = await prisma.report.update({
      where: { id: report.id },
      data: { filePath }
    });

    return updated;
  }

  static async list(userId: string, pagination: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const where: any = {};
    if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'NDMA_ADMIN') {
      where.generatedBy = userId;
    }

    const total = await prisma.report.count({ where });
    const data = await prisma.report.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { generatedAt: 'desc' }
    });

    return createPaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  static async getById(id: string) {
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) throw notFound('Report not found');
    return report;
  }

  static async delete(id: string, userId: string) {
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) throw notFound('Report not found');

    if (fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }

    await prisma.report.delete({ where: { id } });
  }

  static async getFilePath(id: string) {
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) throw notFound('Report not found');
    if (!fs.existsSync(report.filePath)) throw notFound('Report file not found on disk');
    return report.filePath;
  }
}
