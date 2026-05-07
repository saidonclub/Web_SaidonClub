<#
.SYNOPSIS
    SaidonClub Provider Data & Media Optimization Tool

.DESCRIPTION
    Este script genera la estructura de directorios y el archivo JSON estandarizado
    para los proveedores de SaidonClub. Adicionalmente, cuenta con un optimizador
    automático de imágenes y videos (requiere FFmpeg) para garantizar que los assets
    cumplan con los estándares de la plataforma sin perder calidad ni deformarse.

.EXAMPLE
    .\SaidonClub_ProviderTool.ps1 -Action "Generate" -ProviderName "TechStore"
    .\SaidonClub_ProviderTool.ps1 -Action "Optimize" -ProviderDir ".\TechStore"
#>

param (
    [ValidateSet("Generate", "Optimize")]
    [string]$Action = "Generate",

    [string]$ProviderName = "NuevoProveedor",
    [string]$ProviderDir = ""
)

# ------------------------------------------------------------------------
# 1. ESTRUCTURA Y FORMATO JSON DEL PROVEEDOR
# ------------------------------------------------------------------------
function New-ProviderTemplate {
    param([string]$Name)

    $targetDir = ".\$Name"
    $assetsDir = "$targetDir\assets"
    
    # Crear carpetas organizadas
    $folders = @(
        $targetDir,
        "$assetsDir\logo",
        "$assetsDir\local",
        "$assetsDir\productos",
        "$assetsDir\videos"
    )

    foreach ($folder in $folders) {
        if (!(Test-Path -Path $folder)) {
            New-Item -ItemType Directory -Path $folder -Force | Out-Null
        }
    }

    # Crear JSON estandarizado
    $template = @{
        ProviderInfo = @{
            Name = $Name
            Address = "Dirección completa del local"
            WhatsApp = "+593999999999"
            Email = "contacto@proveedor.com"
            GoogleMapsLink = "https://maps.google.com/..."
            LogoPath = "assets/logo/logo.png"
            StorePhotoPath = "assets/local/fachada.jpg"
        }
        Products = @(
            @{
                SKU = "PRD-001"
                Name = "Producto de Ejemplo"
                Category = "Categoría Principal"
                Description = "Descripción detallada del producto"
                Pricing = @{
                    PricePVP = 100.00
                    PriceSaidonClub = 85.00
                    PointsGenerated = 15
                }
                Details = @{
                    Sizes = @("S", "M", "L")
                    Colors = @("Rojo", "Negro")
                    Materials = @("Algodón", "Poliéster")
                    Dimensions = @("10x20x5 cm")
                }
                Media = @{
                    Images = @(
                        "assets/productos/PRD-001_1.jpg",
                        "assets/productos/PRD-001_2.jpg",
                        "assets/productos/PRD-001_3.jpg"
                    )
                    Video = "assets/videos/PRD-001_video.mp4" # Máximo 10 segundos
                }
            }
        )
    }

    # Exportar a JSON con formato legible (Depth asegura que objetos anidados se conviertan bien)
    $jsonContent = $template | ConvertTo-Json -Depth 10
    Set-Content -Path "$targetDir\datos_proveedor.json" -Value $jsonContent -Encoding UTF8

    Write-Host ""
    Write-Host "=========================================================" -ForegroundColor Cyan
    Write-Host "✅ ESTRUCTURA CREADA EXITOSAMENTE EN: $targetDir" -ForegroundColor Green
    Write-Host "=========================================================" -ForegroundColor Cyan
    Write-Host "Instrucciones para el Proveedor:" 
    Write-Host "1. Llenar el archivo 'datos_proveedor.json' con información real."
    Write-Host "2. Colocar foto del logo en 'assets/logo'."
    Write-Host "3. Colocar foto del local en 'assets/local'."
    Write-Host "4. Colocar fotos de productos (máx 3 por producto) en 'assets/productos'."
    Write-Host "5. Colocar videos (máx 10s por producto) en 'assets/videos'."
    Write-Host "6. Ejecutar este script con la opción -Action Optimize para ajustar los medios."
    Write-Host "=========================================================" -ForegroundColor Cyan
    Write-Host ""
}

# ------------------------------------------------------------------------
# 2. OPTIMIZADOR DE MEDIOS (IMÁGENES Y VIDEOS)
# ------------------------------------------------------------------------
function Optimize-ProviderMedia {
    param([string]$Directory)

    if (!(Test-Path $Directory)) {
        Write-Host "❌ Directorio no encontrado: $Directory" -ForegroundColor Red
        return
    }

    Write-Host "⚙️  Iniciando optimización de medios en: $Directory..." -ForegroundColor Cyan

    # Cargar librería de .NET para manejo de imágenes
    Add-Type -AssemblyName System.Drawing

    # 2.1 Optimizar Imágenes
    Write-Host "`n[1/2] Procesando Imágenes (Max 1080x1080, preservando aspecto)..." -ForegroundColor Yellow
    $images = Get-ChildItem -Path $Directory -Include *.jpg, *.jpeg, *.png -Recurse
    $optimizedImages = 0

    foreach ($imgFile in $images) {
        try {
            $img = [System.Drawing.Image]::FromFile($imgFile.FullName)
            
            # Tamaño máximo estandarizado sin deformar
            $maxWidth = 1080
            $maxHeight = 1080

            if ($img.Width -gt $maxWidth -or $img.Height -gt $maxHeight) {
                $ratioX = $maxWidth / $img.Width
                $ratioY = $maxHeight / $img.Height
                $ratio = [Math]::Min($ratioX, $ratioY)

                $newWidth = [int]($img.Width * $ratio)
                $newHeight = [int]($img.Height * $ratio)

                $newImg = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
                $graph = [System.Drawing.Graphics]::FromImage($newImg)
                
                # Configurar para máxima calidad de compresión/redimensión
                $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

                $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)

                $img.Dispose()
                
                $tempPath = $imgFile.FullName + ".tmp"
                # Guardar en JPEG de alta calidad
                $newImg.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
                $newImg.Dispose()
                $graph.Dispose()

                Remove-Item $imgFile.FullName -Force
                Rename-Item $tempPath -NewName $imgFile.Name
                Write-Host "  [OK] Imagen redimensionada y optimizada: $($imgFile.Name)" -ForegroundColor Green
                $optimizedImages++
            } else {
                $img.Dispose()
                Write-Host "  [-] Imagen ya cumple estándares: $($imgFile.Name)" -ForegroundColor DarkGray
            }
        } catch {
            Write-Host "  [ERROR] Fallo al procesar imagen: $($imgFile.Name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    if ($images.Count -eq 0) { Write-Host "  No se encontraron imágenes." -ForegroundColor DarkGray }

    # 2.2 Optimizar Videos (Requiere FFmpeg)
    Write-Host "`n[2/2] Procesando Videos (Max 10s, 720p, preservando aspecto)..." -ForegroundColor Yellow
    $videos = Get-ChildItem -Path $Directory -Include *.mp4, *.mov, *.avi -Recurse
    $optimizedVideos = 0

    if ($videos.Count -gt 0) {
        $ffmpegExists = Get-Command ffmpeg -ErrorAction SilentlyContinue
        if (!$ffmpegExists) {
            Write-Host "⚠️  FFmpeg no está instalado o no está en las variables de entorno (PATH)." -ForegroundColor Magenta
            Write-Host "   No se pueden recortar o comprimir los videos automáticamente." -ForegroundColor Magenta
            Write-Host "   Para habilitar la optimización de video, por favor instale FFmpeg." -ForegroundColor Magenta
        } else {
            foreach ($vidFile in $videos) {
                $tempVid = $vidFile.FullName + ".tmp.mp4"
                
                # Cortar a 10s máximo (-t 10), escalar a 720p de ancho o alto máximo manteniendo aspecto
                # Calidad CRF 28 (buena relación peso/calidad para web), preset fast
                $ffmpegArgs = "-i `"$($vidFile.FullName)`" -t 10 -vf `"scale='min(720,iw)':min'(720,ih)':force_original_aspect_ratio=decrease`" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -y `"$tempVid`""
                
                Write-Host "  Optimizando video: $($vidFile.Name)..." -NoNewline
                $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru

                if ($process.ExitCode -eq 0 -and (Test-Path $tempVid)) {
                    Remove-Item $vidFile.FullName -Force
                    Rename-Item $tempVid -NewName $vidFile.Name
                    Write-Host " [OK]" -ForegroundColor Green
                    $optimizedVideos++
                } else {
                    Write-Host " [ERROR] Revisar archivo." -ForegroundColor Red
                    if (Test-Path $tempVid) { Remove-Item $tempVid -Force }
                }
            }
        }
    } else {
        Write-Host "  No se encontraron videos." -ForegroundColor DarkGray
    }
    
    Write-Host "`n=========================================================" -ForegroundColor Cyan
    Write-Host "✅ PROCESO DE OPTIMIZACIÓN FINALIZADO" -ForegroundColor Green
    Write-Host "   Imágenes optimizadas: $optimizedImages"
    Write-Host "   Videos optimizados: $optimizedVideos"
    Write-Host "=========================================================" -ForegroundColor Cyan
}

# ------------------------------------------------------------------------
# LÓGICA PRINCIPAL
# ------------------------------------------------------------------------
try {
    if ($Action -eq "Generate") {
        New-ProviderTemplate -Name $ProviderName
    } elseif ($Action -eq "Optimize") {
        if ([string]::IsNullOrWhiteSpace($ProviderDir)) {
            Write-Host "❌ Debe especificar el directorio del proveedor usando -ProviderDir" -ForegroundColor Red
            Write-Host "Ejemplo: .\SaidonClub_ProviderTool.ps1 -Action Optimize -ProviderDir '.\MiProveedor'" -ForegroundColor Gray
        } else {
            Optimize-ProviderMedia -Directory $ProviderDir
        }
    }
} catch {
    Write-Host "❌ Ocurrió un error inesperado: $($_.Exception.Message)" -ForegroundColor Red
}
