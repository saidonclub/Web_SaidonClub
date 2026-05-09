$fileList = Get-ChildItem -Path apps/web/lib -Recurse -Include *.ts,*.tsx

foreach ($file in $fileList) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix specific broken relative imports
    $content = $content -replace "from\s+['""]\.\./auth['""]", "from '@/lib/auth'"
    $content = $content -replace "from\s+['""]\./auth['""]", "from '@/lib/auth'"
    $content = $content -replace "from\s+['""]\.\./csrf['""]", "from '@/lib/auth/csrf'"
    $content = $content -replace "from\s+['""]\./prisma['""]", "from '@/lib/utils/prisma'"
    $content = $content -replace "from\s+['""]\./import-validator['""]", "from '@/lib/services/import-validator'"
    $content = $content -replace "from\s+['""]\./export-types['""]", "from '@/lib/services/export-types'"
    
    # Also fix some double quote variations
    $content = $content -replace "from\s+[""]\.\./auth[""]", "from '@/lib/auth'"
    $content = $content -replace "from\s+[""]\./auth[""]", "from '@/lib/auth'"
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName $content -NoNewline
        Write-Host "Fixed relative imports in $($file.FullName)"
    }
}

# Also fix the one in app/api/admin/export/route.ts I found earlier
$routeFile = "apps/web/app/api/admin/export/route.ts"
if (Test-Path $routeFile) {
    $content = Get-Content $routeFile -Raw
    $content = $content -replace "from\s+['""]@/lib/export-types['""]", "from '@/lib/services/export-types'"
    Set-Content $routeFile $content -NoNewline
    Write-Host "Fixed import in $routeFile"
}
