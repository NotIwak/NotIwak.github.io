import { promises as fs } from 'fs';
import path from 'path';
import XLSX from 'xlsx';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. 读取 XLSX 文件
    const filePath = path.join(process.cwd(), 'data', 'Data.xlsx');
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(sheet);

    // 2. 获取前端提交的凭证
    const { username, password } = req.body;

    // 3. 验证用户
    const user = users.find(u => 
      u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. 返回成功响应（移除密码字段）
    const { password: _, ...safeUser } = user;
    res.status(200).json({ user: safeUser });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}