$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$imagesDir = Join-Path $PSScriptRoot '..\images'
[System.IO.Directory]::CreateDirectory((Resolve-Path $imagesDir).Path) | Out-Null

function New-Canvas {
  param([int]$Width = 1801, [int]$Height = 1263)
  $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.Color]::White)
  return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function Save-Canvas {
  param([hashtable]$Canvas, [string]$FileName)
  $path = Join-Path $imagesDir $FileName
  $Canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $Canvas.Graphics.Dispose()
  $Canvas.Bitmap.Dispose()
}

function New-Pen { param([string]$Color, [float]$Width = 4) return New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($Color)), $Width }
function New-Brush { param([string]$Color) return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($Color)) }

function Draw-Label {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [float]$X,
    [float]$Y,
    [string]$Color = '#111827',
    [float]$Size = 28,
    [string]$FontName = 'Arial'
  )
  if ([string]::IsNullOrWhiteSpace($Text)) { return }
  $font = New-Object System.Drawing.Font($FontName, $Size, [System.Drawing.FontStyle]::Regular)
  $brush = New-Brush $Color
  $background = New-Brush '#ffffff'
  $textSize = $Graphics.MeasureString($Text, $font)
  $Graphics.FillRectangle($background, $X - 8, $Y - 4, $textSize.Width + 16, $textSize.Height + 8)
  $Graphics.DrawString($Text, $font, $brush, $X, $Y)
  $background.Dispose()
  $brush.Dispose()
  $font.Dispose()
}

function Draw-Circle {
  param([System.Drawing.Graphics]$Graphics, [System.Drawing.Pen]$Pen, [float]$CenterX, [float]$CenterY, [float]$Radius)
  $Graphics.DrawEllipse($Pen, $CenterX - $Radius, $CenterY - $Radius, $Radius * 2, $Radius * 2)
}

function Draw-Point {
  param([System.Drawing.Graphics]$Graphics, [System.Drawing.Brush]$Brush, [float]$X, [float]$Y, [float]$Size = 14)
  $Graphics.FillEllipse($Brush, $X - ($Size / 2), $Y - ($Size / 2), $Size, $Size)
}

function Get-CirclePoint {
  param([float]$CenterX, [float]$CenterY, [float]$Radius, [float]$Degrees)
  $radians = [Math]::PI * $Degrees / 180.0
  return [PSCustomObject]@{
    X = $CenterX + $Radius * [Math]::Cos($radians)
    Y = $CenterY - $Radius * [Math]::Sin($radians)
  }
}

function Draw-AngleArc {
  param([System.Drawing.Graphics]$Graphics, [System.Drawing.Pen]$Pen, [float]$X, [float]$Y, [float]$Radius, [float]$StartAngle, [float]$SweepAngle)
  $Graphics.DrawArc($Pen, $X - $Radius, $Y - $Radius, $Radius * 2, $Radius * 2, $StartAngle, $SweepAngle)
}

$pens = @{
  black  = New-Pen '#1f2937' 4
  blue   = New-Pen '#4f46e5' 5
  purple = New-Pen '#8b5cf6' 5
  pink   = New-Pen '#ec4899' 5
  green  = New-Pen '#16a34a' 5
  orange = New-Pen '#f97316' 5
  gray   = New-Pen '#94a3b8' 3
}

$brushes = @{
  dark      = New-Brush '#111827'
  blue      = New-Brush '#4f46e5'
  purple    = New-Brush '#8b5cf6'
  pink      = New-Brush '#ec4899'
  green     = New-Brush '#16a34a'
  orange    = New-Brush '#f97316'
  lightBlue = New-Brush '#dbeafe'
  lightPink = New-Brush '#fce7f3'
  lightMint = New-Brush '#dcfce7'
}

function Draw-DiameterSemicircle {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 720; $cy = 660; $r = 350
  Draw-Circle $g $pens.black $cx $cy $r
  $left = Get-CirclePoint $cx $cy $r 180
  $right = Get-CirclePoint $cx $cy $r 0
  $top = Get-CirclePoint $cx $cy $r 118
  $g.DrawLine($pens.purple, $left.X, $left.Y, $right.X, $right.Y)
  $g.DrawLine($pens.black, $left.X, $left.Y, $top.X, $top.Y)
  $g.DrawLine($pens.black, $top.X, $top.Y, $right.X, $right.Y)
  Draw-AngleArc $g $pens.green $top.X $top.Y 62 -24 -68
  Draw-Point $g $brushes.purple $left.X $left.Y 14
  Draw-Point $g $brushes.purple $right.X $right.Y 14
  Draw-Point $g $brushes.blue $top.X $top.Y 14
  Draw-Label $g $cfg.AngleLabel 430 395 '#16a34a' 32
  Save-Canvas $c $cfg.File
}

function Draw-CentralInscribed {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 730; $cy = 660; $r = 350
  Draw-Circle $g $pens.black $cx $cy $r
  $a = Get-CirclePoint $cx $cy $r 145
  $b = Get-CirclePoint $cx $cy $r 18
  $p = Get-CirclePoint $cx $cy $r 240
  $g.DrawLine($pens.blue, $cx, $cy, $a.X, $a.Y)
  $g.DrawLine($pens.blue, $cx, $cy, $b.X, $b.Y)
  $g.DrawLine($pens.black, $a.X, $a.Y, $p.X, $p.Y)
  $g.DrawLine($pens.black, $b.X, $b.Y, $p.X, $p.Y)
  Draw-AngleArc $g $pens.orange $cx $cy 88 20 122
  Draw-AngleArc $g $pens.green $p.X $p.Y 58 -24 -70
  Draw-Point $g $brushes.dark $cx $cy 16
  Draw-Point $g $brushes.blue $a.X $a.Y 14
  Draw-Point $g $brushes.blue $b.X $b.Y 14
  Draw-Point $g $brushes.purple $p.X $p.Y 14
  Draw-Label $g 'O' ($cx + 18) ($cy - 40) '#111827' 28
  Draw-Label $g $cfg.CentralLabel 800 520 '#f97316' 32
  Draw-Label $g $cfg.InscribedLabel 345 815 '#16a34a' 32
  Save-Canvas $c $cfg.File
}

function Draw-SameSegment {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 735; $cy = 660; $r = 345
  Draw-Circle $g $pens.black $cx $cy $r
  $a = Get-CirclePoint $cx $cy $r 140
  $b = Get-CirclePoint $cx $cy $r 20
  $p1 = Get-CirclePoint $cx $cy $r 235
  $p2 = Get-CirclePoint $cx $cy $r 310
  $g.DrawLine($pens.black, $a.X, $a.Y, $p1.X, $p1.Y)
  $g.DrawLine($pens.black, $b.X, $b.Y, $p1.X, $p1.Y)
  $g.DrawLine($pens.purple, $a.X, $a.Y, $p2.X, $p2.Y)
  $g.DrawLine($pens.purple, $b.X, $b.Y, $p2.X, $p2.Y)
  Draw-AngleArc $g $pens.green $p1.X $p1.Y 55 -35 -62
  Draw-AngleArc $g $pens.green $p2.X $p2.Y 55 150 58
  Draw-Point $g $brushes.blue $a.X $a.Y 14
  Draw-Point $g $brushes.blue $b.X $b.Y 14
  Draw-Point $g $brushes.purple $p1.X $p1.Y 14
  Draw-Point $g $brushes.purple $p2.X $p2.Y 14
  Draw-Label $g $cfg.KnownLabel 345 820 '#16a34a' 30
  Draw-Label $g $cfg.UnknownLabel 970 800 '#16a34a' 30
  Save-Canvas $c $cfg.File
}

function Draw-CyclicQuad {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 760; $cy = 655; $r = 355
  Draw-Circle $g $pens.black $cx $cy $r
  $a = Get-CirclePoint $cx $cy $r 145
  $b = Get-CirclePoint $cx $cy $r 18
  $cpt = Get-CirclePoint $cx $cy $r 302
  $d = Get-CirclePoint $cx $cy $r 214
  $poly = @(
    (New-Object System.Drawing.PointF($a.X, $a.Y)),
    (New-Object System.Drawing.PointF($b.X, $b.Y)),
    (New-Object System.Drawing.PointF($cpt.X, $cpt.Y)),
    (New-Object System.Drawing.PointF($d.X, $d.Y))
  )
  $g.FillPolygon($brushes.lightBlue, $poly)
  $g.DrawPolygon($pens.pink, $poly)
  Draw-Point $g $brushes.pink $a.X $a.Y 14
  Draw-Point $g $brushes.pink $b.X $b.Y 14
  Draw-Point $g $brushes.pink $cpt.X $cpt.Y 14
  Draw-Point $g $brushes.pink $d.X $d.Y 14
  Draw-Label $g $cfg.KnownLabel 465 390 '#ec4899' 30
  Draw-Label $g $cfg.UnknownLabel 970 835 '#ec4899' 30
  Save-Canvas $c $cfg.File
}

function Draw-TangentRadius {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 680; $cy = 650; $r = 310
  Draw-Circle $g $pens.blue $cx $cy $r
  $touch = Get-CirclePoint $cx $cy $r 25
  $g.DrawLine($pens.orange, $touch.X - 520, $touch.Y + 230, $touch.X + 520, $touch.Y - 230)
  $g.DrawLine($pens.green, $cx, $cy, $touch.X, $touch.Y)
  $g.DrawRectangle($pens.green, $touch.X - 48, $touch.Y - 10, 44, 44)
  Draw-Point $g $brushes.dark $cx $cy 16
  Draw-Point $g $brushes.orange $touch.X $touch.Y 16
  Draw-Label $g 'O' ($cx + 18) ($cy - 40) '#111827' 28
  Draw-Label $g $cfg.AngleLabel ($touch.X + 10) ($touch.Y - 85) '#16a34a' 30
  Save-Canvas $c $cfg.File
}

function Draw-ChordBisector {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 730; $cy = 660; $r = 350
  Draw-Circle $g $pens.black $cx $cy $r
  $y = $cy - 80
  $x1 = $cx - 245
  $x2 = $cx + 245
  $g.DrawLine($pens.purple, $x1, $y, $x2, $y)
  $g.DrawLine($pens.green, $cx, $cy, $cx, $y)
  $g.DrawRectangle($pens.green, $cx - 30, $y - 30, 28, 28)
  Draw-Point $g $brushes.dark $cx $cy 16
  Draw-Point $g $brushes.blue $cx $y 14
  Draw-Point $g $brushes.purple $x1 $y 14
  Draw-Point $g $brushes.purple $x2 $y 14
  Draw-Label $g 'A' ($x1 - 35) ($y - 42) '#8b5cf6' 28
  Draw-Label $g 'B' ($x2 + 12) ($y - 42) '#8b5cf6' 28
  Draw-Label $g 'D' ($cx + 18) ($y - 48) '#16a34a' 28
  Draw-Label $g 'O' ($cx + 18) ($cy - 38) '#111827' 28
  Draw-Label $g $cfg.LeftLabel ($cx - 160) ($y + 20) '#8b5cf6' 28
  Draw-Label $g $cfg.RightLabel ($cx + 72) ($y + 20) '#8b5cf6' 28
  Save-Canvas $c $cfg.File
}

function Draw-EqualChords {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 730; $cy = 660; $r = 350
  Draw-Circle $g $pens.black $cx $cy $r
  $g.DrawLine($pens.purple, $cx - 230, $cy - 150, $cx + 230, $cy - 150)
  $g.DrawLine($pens.purple, $cx - 230, $cy + 150, $cx + 230, $cy + 150)
  $g.DrawLine($pens.green, $cx, $cy, $cx, $cy - 150)
  $g.DrawLine($pens.green, $cx, $cy, $cx, $cy + 150)
  $g.DrawRectangle($pens.green, $cx - 30, $cy - 180, 28, 28)
  $g.DrawRectangle($pens.green, $cx - 30, $cy + 122, 28, 28)
  Draw-Point $g $brushes.dark $cx $cy 16
  Draw-Label $g 'd' ($cx + 26) ($cy - 104) '#16a34a' 28
  Draw-Label $g 'd' ($cx + 26) ($cy + 106) '#16a34a' 28
  Save-Canvas $c $cfg.File
}

function Draw-ExternalTangents {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 610; $cy = 650; $r = 235
  Draw-Circle $g $pens.blue $cx $cy $r
  $externalX = 1240; $externalY = 610
  $upper = Get-CirclePoint $cx $cy $r 120
  $lower = Get-CirclePoint $cx $cy $r 302
  $g.DrawLine($pens.purple, $externalX, $externalY, $upper.X, $upper.Y)
  $g.DrawLine($pens.purple, $externalX, $externalY, $lower.X, $lower.Y)
  $g.DrawLine($pens.gray, $cx, $cy, $externalX, $externalY)
  Draw-Point $g $brushes.orange $externalX $externalY 16
  Draw-Point $g $brushes.purple $upper.X $upper.Y 14
  Draw-Point $g $brushes.purple $lower.X $lower.Y 14
  Draw-Label $g $cfg.UpperLabel 805 335 '#8b5cf6' 28
  Draw-Label $g $cfg.LowerLabel 805 790 '#8b5cf6' 28
  Draw-Label $g $cfg.PointLabel ($externalX + 18) ($externalY - 24) '#f97316' 28
  Save-Canvas $c $cfg.File
}

function Draw-AlternateSegment {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 710; $cy = 680; $r = 335
  Draw-Circle $g $pens.blue $cx $cy $r
  $t1 = Get-CirclePoint $cx $cy $r 115
  $t2 = Get-CirclePoint $cx $cy $r 325
  $p = Get-CirclePoint $cx $cy $r 20
  $g.DrawLine($pens.purple, $t1.X - 280, $t1.Y - 60, $t1.X + 430, $t1.Y + 90)
  $g.DrawLine($pens.orange, $t1.X, $t1.Y, $t2.X, $t2.Y)
  $g.DrawLine($pens.orange, $p.X, $p.Y, $t2.X, $t2.Y)
  Draw-AngleArc $g $pens.green $t1.X $t1.Y 70 340 30
  Draw-AngleArc $g $pens.green $p.X $p.Y 58 155 36
  Draw-Point $g $brushes.purple $t1.X $t1.Y 14
  Draw-Point $g $brushes.orange $t2.X $t2.Y 14
  Draw-Point $g $brushes.dark $p.X $p.Y 14
  Draw-Label $g $cfg.TangentLabel ($t1.X + 50) ($t1.Y - 55) '#16a34a' 28
  Draw-Label $g $cfg.AngleLabel ($p.X - 28) ($p.Y - 78) '#16a34a' 30
  Save-Canvas $c $cfg.File
}

function Draw-ExternallyTangentCircles {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $c1x = 570; $c1y = 670; $r1 = 195
  $c2x = 1000; $c2y = 670; $r2 = 235
  Draw-Circle $g $pens.pink $c1x $c1y $r1
  Draw-Circle $g $pens.blue $c2x $c2y $r2
  $g.DrawLine($pens.orange, $c1x, $c1y, $c2x, $c2y)
  Draw-Point $g $brushes.pink $c1x $c1y 16
  Draw-Point $g $brushes.blue $c2x $c2y 16
  Draw-Point $g $brushes.orange ($c1x + $r1) $c1y 14
  Draw-Label $g $cfg.LeftLabel 605 720 '#ec4899' 28
  Draw-Label $g $cfg.RightLabel 1040 720 '#4f46e5' 28
  Draw-Label $g $cfg.CenterLabel 765 605 '#f97316' 30
  Save-Canvas $c $cfg.File
}

function Draw-RegularHexagon {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 740; $cy = 650; $r = 325
  Draw-Circle $g $pens.blue $cx $cy $r
  $points = @()
  foreach ($deg in 90, 30, -30, -90, -150, 150) {
    $points += Get-CirclePoint $cx $cy $r $deg
  }
  $poly = $points | ForEach-Object { New-Object System.Drawing.PointF($_.X, $_.Y) }
  $g.FillPolygon($brushes.lightMint, $poly)
  $g.DrawPolygon($pens.green, $poly)
  $g.DrawLine($pens.orange, $cx, $cy, $points[0].X, $points[0].Y)
  $g.DrawLine($pens.purple, $points[0].X, $points[0].Y, $points[1].X, $points[1].Y)
  Draw-Point $g $brushes.dark $cx $cy 16
  foreach ($pt in $points) { Draw-Point $g $brushes.green $pt.X $pt.Y 14 }
  Draw-Label $g $cfg.RadiusLabel 965 310 '#f97316' 28
  Draw-Label $g $cfg.SideLabel 950 390 '#8b5cf6' 28
  Save-Canvas $c $cfg.File
}

function Draw-CircleSegment {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  $cx = 730; $cy = 650; $r = 350
  Draw-Circle $g $pens.black $cx $cy $r
  $left = Get-CirclePoint $cx $cy $r 180
  $right = Get-CirclePoint $cx $cy $r 0
  $topRight = Get-CirclePoint $cx $cy $r 35
  $g.DrawLine($pens.purple, $left.X, $left.Y, $right.X, $right.Y)
  $g.DrawLine($pens.blue, $cx, $cy, $topRight.X, $topRight.Y)
  Draw-Point $g $brushes.dark $cx $cy 16
  Draw-Point $g $brushes.purple $left.X $left.Y 14
  Draw-Point $g $brushes.purple $right.X $right.Y 14
  Draw-Point $g $brushes.blue $topRight.X $topRight.Y 14
  Draw-Label $g 'A' ($left.X - 28) ($left.Y - 52) '#8b5cf6' 28
  Draw-Label $g 'B' ($right.X + 14) ($right.Y - 52) '#8b5cf6' 28
  Draw-Label $g 'C' ($topRight.X + 14) ($topRight.Y - 42) '#4f46e5' 28
  Draw-Label $g 'O' ($cx + 18) ($cy - 40) '#111827' 28
  Save-Canvas $c $cfg.File
}

$configs = @(
  @{ File = 'q1.png'; Type = 'semi'; AngleLabel = '?' },
  @{ File = 'q2.png'; Type = 'central'; CentralLabel = '110°'; InscribedLabel = '?' },
  @{ File = 'q3.png'; Type = 'same'; KnownLabel = '52°'; UnknownLabel = '52°' },
  @{ File = 'q4.png'; Type = 'cyclic'; KnownLabel = '99°'; UnknownLabel = '?' },
  @{ File = 'q5.png'; Type = 'tangent'; AngleLabel = '90°' },
  @{ File = 'q6.png'; Type = 'chord'; LeftLabel = 'AD = 4'; RightLabel = 'DB = ?' },
  @{ File = 'q7.png'; Type = 'external'; UpperLabel = '13 cm'; LowerLabel = '?'; PointLabel = 'D' },
  @{ File = 'q8.png'; Type = 'alternate'; TangentLabel = '48°'; AngleLabel = '48°' },
  @{ File = 'q9.png'; Type = 'circles'; LeftLabel = 'r'; RightLabel = 'r + 4'; CenterLabel = '14 cm' },
  @{ File = 'q10.png'; Type = 'hex'; RadiusLabel = 'r = ?'; SideLabel = 'P = 30 cm' },
  @{ File = 'q11.png'; Type = 'segment' },
  @{ File = 'q12.png'; Type = 'central'; CentralLabel = '?'; InscribedLabel = '35°' },
  @{ File = 'q13.png'; Type = 'cyclic'; KnownLabel = '68°'; UnknownLabel = '?' },
  @{ File = 'q14.png'; Type = 'tangent'; AngleLabel = '' },
  @{ File = 'q15.png'; Type = 'equalchords' },
  @{ File = 'q16.png'; Type = 'alternate'; TangentLabel = '41°'; AngleLabel = '?' },
  @{ File = 'q17.png'; Type = 'circles'; LeftLabel = '4 cm'; RightLabel = '9 cm'; CenterLabel = '?' },
  @{ File = 'q18.png'; Type = 'external'; UpperLabel = 'PA = 12 cm'; LowerLabel = 'PB = ?'; PointLabel = 'P' },
  @{ File = 'q19.png'; Type = 'hex'; RadiusLabel = 'r = 8 cm'; SideLabel = 'a = ?' },
  @{ File = 'q20.png'; Type = 'cyclic'; KnownLabel = '97°'; UnknownLabel = 'x = ?' }
)

foreach ($cfg in $configs) {
  switch ($cfg.Type) {
    'semi' { Draw-DiameterSemicircle $cfg }
    'central' { Draw-CentralInscribed $cfg }
    'same' { Draw-SameSegment $cfg }
    'cyclic' { Draw-CyclicQuad $cfg }
    'tangent' { Draw-TangentRadius $cfg }
    'chord' { Draw-ChordBisector $cfg }
    'equalchords' { Draw-EqualChords $cfg }
    'external' { Draw-ExternalTangents $cfg }
    'alternate' { Draw-AlternateSegment $cfg }
    'circles' { Draw-ExternallyTangentCircles $cfg }
    'hex' { Draw-RegularHexagon $cfg }
    'segment' { Draw-CircleSegment $cfg }
  }
}

foreach ($pen in $pens.Values) { $pen.Dispose() }
foreach ($brush in $brushes.Values) { $brush.Dispose() }

Write-Output 'Generated q1.png through q20.png'
