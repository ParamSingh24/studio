import type { DuplicateGroup, Category, AppFile } from './types';

export const allCategories: Category[] = ["Games", "Productivity", "Development", "Browsers", "Media", "Graphics", "Security", "System Tools", "Other"];

const createFile = (id: number, name: string, path: string, size: number, lastModified: string, hash: string, category: Category): AppFile => ({
    id: `file-${id}`,
    name,
    path,
    size,
    type: 'application/octet-stream',
    lastModified: new Date(lastModified),
    hash,
    category,
});

const hash1 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const hash2 = "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e";
const hash3 = "f2d2b2f57875955e6c7d3b0c3e7f9f3f3e1b0b5a6c4c8d9e2b2a1a0d9c8c7b6a";
const hash4 = "b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2";

export const mockDuplicateGroups: DuplicateGroup[] = [
    {
        hash: hash1,
        files: [
            createFile(1, 'game_installer_v1.exe', 'C:/Downloads/Installers', 157286400, '2023-01-15T10:00:00Z', hash1, 'Games'),
            createFile(2, 'game_installer_v1.exe', 'D:/Backup/Old_Downloads', 157286400, '2022-11-20T15:30:00Z', hash1, 'Games'),
        ],
        totalSize: 314572800,
    },
    {
        hash: hash2,
        files: [
            createFile(3, 'Annual Report 2023.pdf', 'C:/Users/You/Documents', 2097152, '2024-03-01T09:00:00Z', hash2, 'Productivity'),
            createFile(4, 'Annual Report 2023.pdf', 'C:/Users/You/Desktop/Important', 2097152, '2024-03-10T11:25:00Z', hash2, 'Productivity'),
            createFile(5, 'Copy of Annual Report 2023.pdf', 'E:/Shared/Reports', 2097152, '2024-02-28T18:00:00Z', hash2, 'Productivity'),
        ],
        totalSize: 6291456,
    },
    {
        hash: hash3,
        files: [
            createFile(6, 'project-styles.css', '~/dev/project-alpha/src/styles', 12288, '2024-05-20T14:00:00Z', hash3, 'Development'),
            createFile(7, 'project-styles.css', '~/dev/project-beta/assets', 12288, '2024-04-11T16:30:00Z', hash3, 'Development'),
        ],
        totalSize: 24576,
    },
    {
        hash: hash4,
        files: [
            createFile(8, 'family_vacation_012.jpg', '/photos/2023/summer', 4194304, '2023-08-10T14:00:00Z', hash4, 'Media'),
            createFile(9, 'IMG_5082.jpg', '/phone_backup/DCIM', 4194304, '2023-08-09T19:45:00Z', hash4, 'Media'),
        ],
        totalSize: 8388608,
    }
];
