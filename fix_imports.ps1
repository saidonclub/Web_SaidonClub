$mappings = @{
    "@/lib/appointment-actions" = "@/lib/actions/appointment"
    "@/lib/bipartite-form-actions" = "@/lib/actions/bipartite-form"
    "@/lib/event-actions" = "@/lib/actions/event"
    "@/lib/family-beneficiary-actions" = "@/lib/actions/family-beneficiary"
    "@/lib/invoice-actions" = "@/lib/actions/invoice"
    "@/lib/kyc-actions" = "@/lib/actions/kyc"
    "@/lib/review-actions" = "@/lib/actions/review"
    "@/lib/service-listing-actions" = "@/lib/actions/service-listing"
    "@/lib/service-provider-actions" = "@/lib/actions/service-provider"
    "@/lib/auth" = "@/lib/auth/core"
    "@/lib/csrf" = "@/lib/auth/csrf"
    "@/lib/security" = "@/lib/auth/security"
    "@/lib/rate-limit" = "@/lib/auth/rate-limit"
    "@/lib/dashboard-data" = "@/lib/data/dashboard"
    "@/lib/marketplace-utils" = "@/lib/data/marketplace"
    "@/lib/recommendations" = "@/lib/data/recommendations"
    "@/lib/pricing-engine" = "@/lib/data/pricing"
    "@/lib/content-plan" = "@/lib/data/content-plan"
    "@/lib/sales-scripts" = "@/lib/data/sales-scripts"
    "@/lib/export-service" = "@/lib/services/export"
    "@/lib/import-service" = "@/lib/services/import"
    "@/lib/import-validator" = "@/lib/services/import-validator"
    "@/lib/media-upload" = "@/lib/services/media"
    "@/lib/qr" = "@/lib/services/qr"
    "@/lib/whatsapp-onboarding" = "@/lib/services/whatsapp"
    "@/lib/geolocation" = "@/lib/utils/geolocation"
    "@/lib/prisma" = "@/lib/utils/prisma"
}

Write-Host "Starting import migration in apps/web..."

Get-ChildItem -Path apps/web -Recurse -Include *.ts,*.tsx | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    $changed = $false
    
    foreach ($key in $mappings.Keys) {
        # Pattern to match the exact import path inside single or double quotes
        $pattern = "([""'])" + [regex]::Escape($key) + "([""'])"
        if ($content -match $pattern) {
            $replacement = "`$1" + $mappings[$key] + "`$2"
            $content = $content -replace $pattern, $replacement
            $changed = $true
            Write-Host "Updated $key -> $($mappings[$key]) in $filePath"
        }
    }
    
    if ($changed) {
        Set-Content $filePath $content -NoNewline
    }
}

Write-Host "Migration complete."
