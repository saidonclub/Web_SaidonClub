$files = Get-ChildItem -Path apps/web -Filter *.ts* -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    if ($content -match '@/lib/utils/prisma') {
        $content = $content -replace '@/lib/utils/prisma', '@/lib/prisma'
        $content | Set-Content $file.FullName
        Write-Host "Updated $($file.FullName)"
    }
}
