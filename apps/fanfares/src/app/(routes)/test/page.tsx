'use client'

import { uploadToShdwDrive } from '@/app/controllers/shdw/upload';
import React, { useState } from 'react';

export default function TestPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (event: any) => {
        const fileList = event.target.files as FileList;
        const newFiles = [];

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList.item(i);
            if (!file) continue;

            newFiles.push(file);
        }

        setFiles(newFiles);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();

        if(isLoading) return;
        setIsLoading(true);

        uploadToShdwDrive(files).then(() => {
            alert('success');
        }).catch((e) => {
            alert(e);
            console.log(e);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input multiple type="file" className="border-2 border-black" onChange={handleFileChange} />
            <button type="submit" className="border-2 border-black">Submit</button>
        </form>
    );
}