$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$imagesDir = Join-Path $PSScriptRoot '..\images'
[System.IO.Directory]::CreateDirectory((Resolve-Path $imagesDir).Path) | Out-Null

function New-Canvas {
  param([int]$Width = 1801, [int]$Height = 1263)
  $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
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

function Draw-Title {
  param([System.Drawing.Graphics]$Graphics, [string]$Text)
  $font = New-Object System.Drawing.Font('Arial', 34, [System.Drawing.FontStyle]::Regular)
  $brush = New-Brush '#0f172a'
  $Graphics.DrawString($Text, $font, $brush, 70, 50)
  $brush.Dispose()
  $font.Dispose()
}

function Draw-Label {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [float]$X,
    [float]$Y,
    [string]$Color = '#111827',
    [float]$Size = 28
  )
  $font = New-Object System.Drawing.Font('Arial', $Size, [System.Drawing.FontStyle]::Regular)
  $brush = New-Brush $Color
  $Graphics.DrawString($Text, $font, $brush, $X, $Y)
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

function Draw-Arc {
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

function Draw-SameSegment {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $cx = 720; $cy = 670; $r = 330
  Draw-Circle $g $pens.black $cx $cy $r
  $a = Get-CirclePoint $cx $cy $r 140
  $b = Get-CirclePoint $cx $cy $r 20
  $p1 = Get-CirclePoint $cx $cy $r 235
  $p2 = Get-CirclePoint $cx $cy $r 310
  $g.DrawLine($pens.black, $a.X, $a.Y, $p1.X, $p1.Y)
  $g.DrawLine($pens.black, $b.X, $b.Y, $p1.X, $p1.Y)
  $g.DrawLine($pens.purple, $a.X, $a.Y, $p2.X, $p2.Y)
  $g.DrawLine($pens.purple, $b.X, $b.Y, $p2.X, $p2.Y)
  Draw-Arc $g $pens.green $p1.X $p1.Y 55 -35 -62
  Draw-Arc $g $pens.green $p2.X $p2.Y 55 150 58
  Draw-Point $g $brushes.blue $a.X $a.Y 14
  Draw-Point $g $brushes.blue $b.X $b.Y 14
  Draw-Point $g $brushes.purple $p1.X $p1.Y 14
  Draw-Point $g $brushes.purple $p2.X $p2.Y 14
  Draw-Label $g $cfg.KnownLabel 330 820 '#16a34a' 28
  Draw-Label $g $cfg.UnknownLabel 970 810 '#16a34a' 30
  Save-Canvas $c $cfg.File
}

function Draw-CentralInscribed {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $cx = 720; $cy = 670; $r = 330
  Draw-Circle $g $pens.black $cx $cy $r
  $a = Get-CirclePoint $cx $cy $r 145
  $b = Get-CirclePoint $cx $cy $r 18
  $p = Get-CirclePoint $cx $cy $r 240
  $g.DrawLine($pens.blue, $cx, $cy, $a.X, $a.Y)
  $g.DrawLine($pens.blue, $cx, $cy, $b.X, $b.Y)
  $g.DrawLine($pens.black, $a.X, $a.Y, $p.X, $p.Y)
  $g.DrawLine($pens.black, $b.X, $b.Y, $p.X, $p.Y)
  Draw-Arc $g $pens.orange $cx $cy 85 20 120
  Draw-Arc $g $pens.green $p.X $p.Y 55 -25 -70
  Draw-Point $g $brushes.dark $cx $cy 16
  Draw-Point $g $brushes.blue $a.X $a.Y 14
  Draw-Point $g $brushes.blue $b.X $b.Y 14
  Draw-Point $g $brushes.purple $p.X $p.Y 14
  if ($cfg.CentralLabel) { Draw-Label $g $cfg.CentralLabel 780 545 '#f97316' 30 }
  if ($cfg.InscribedLabel) { Draw-Label $g $cfg.InscribedLabel 330 835 '#16a34a' 30 }
  Save-Canvas $c $cfg.File
}

function Draw-CyclicQuad {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $cx = 760; $cy = 660; $r = 345
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
  Draw-Label $g $cfg.KnownLabel 470 420 '#ec4899' 30
  Draw-Label $g $cfg.UnknownLabel 975 845 '#ec4899' 30
  Save-Canvas $c $cfg.File
}

function Draw-TangentRadius {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $cx = 670; $cy = 650; $r = 300
  Draw-Circle $g $pens.blue $cx $cy $r
  $touch = Get-CirclePoint $cx $cy $r 25
  $g.DrawLine($pens.orange, $touch.X - 520, $touch.Y + 230, $touch.X + 520, $touch.Y - 230)
  $g.DrawLine($pens.green, $cx, $cy, $touch.X, $touch.Y)
  $g.DrawRectangle($pens.green, $touch.X - 48, $touch.Y - 10, 44, 44)
  Draw-Point $g $brushes.dark $cx $cy 16
  Draw-Point $g $brushes.orange $touch.X $touch.Y 16
  if ($cfg.AngleLabel) { Draw-Label $g $cfg.AngleLabel ($touch.X + 10) ($touch.Y - 85) '#16a34a' 30 }
  Save-Canvas $c $cfg.File
}

function Draw-DiameterSemicircle {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $cx = 700; $cy = 680; $r = 340
  Draw-Circle $g $pens.black $cx $cy $r
  $left = Get-CirclePoint $cx $cy $r 180
  $right = Get-CirclePoint $cx $cy $r 0
  $top = Get-CirclePoint $cx $cy $r 120
  $g.DrawLine($pens.purple, $left.X, $left.Y, $right.X, $right.Y)
  $g.DrawLine($pens.black, $left.X, $left.Y, $top.X, $top.Y)
  $g.DrawLine($pens.black, $top.X, $top.Y, $right.X, $right.Y)
  Draw-Arc $g $pens.green $top.X $top.Y 60 -25 -68
  Draw-Point $g $brushes.purple $left.X $left.Y 14
  Draw-Point $g $brushes.purple $right.X $right.Y 14
  Draw-Point $g $brushes.blue $top.X $top.Y 14
  Draw-Label $g $cfg.AngleLabel 410 450 '#16a34a' 30
  Save-Canvas $c $cfg.File
}

function Draw-ChordMidpoint {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $cx = 720; $cy = 660; $r = 340
  Draw-Circle $g $pens.black $cx $cy $r
  $y = $cy - 80
  $x1 = $cx - 235
  $x2 = $cx + 235
  $g.DrawLine($pens.purple, $x1, $y, $x2, $y)
  $g.DrawLine($pens.green, $cx, $cy, $cx, $y)
  $g.DrawRectangle($pens.green, $cx - 30, $y - 30, 28, 28)
  Draw-Point $g $brushes.dark $cx $cy 16
  Draw-Point $g $brushes.blue $cx $y 14
  Draw-Label $g $cfg.CenterLabel ($cx + 18) ($cy - 40) '#111827' 28
  Draw-Label $g $cfg.MeetLabel ($cx + 18) ($y - 50) '#16a34a' 28
  Save-Canvas $c $cfg.File
}

function Draw-EqualChords {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $cx = 720; $cy = 660; $r = 340
  Draw-Circle $g $pens.black $cx $cy $r
  $g.DrawLine($pens.purple, $cx - 220, $cy - 150, $cx + 220, $cy - 150)
  $g.DrawLine($pens.purple, $cx - 220, $cy + 150, $cx + 220, $cy + 150)
  $g.DrawLine($pens.green, $cx, $cy, $cx, $cy - 150)
  $g.DrawLine($pens.green, $cx, $cy, $cx, $cy + 150)
  Draw-Point $g $brushes.dark $cx $cy 16
  Draw-Label $g 'd' ($cx + 24) ($cy - 100) '#16a34a' 28
  Draw-Label $g 'd' ($cx + 24) ($cy + 105) '#16a34a' 28
  Save-Canvas $c $cfg.File
}

function Draw-ExternalTangents {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $cx = 600; $cy = 650; $r = 230
  Draw-Circle $g $pens.blue $cx $cy $r
  $externalX = 1230; $externalY = 610
  $upper = Get-CirclePoint $cx $cy $r 120
  $lower = Get-CirclePoint $cx $cy $r 302
  $g.DrawLine($pens.purple, $externalX, $externalY, $upper.X, $upper.Y)
  $g.DrawLine($pens.purple, $externalX, $externalY, $lower.X, $lower.Y)
  $g.DrawLine($pens.gray, $cx, $cy, $externalX, $externalY)
  Draw-Point $g $brushes.orange $externalX $externalY 16
  Draw-Point $g $brushes.purple $upper.X $upper.Y 14
  Draw-Point $g $brushes.purple $lower.X $lower.Y 14
  Draw-Label $g $cfg.UpperLabel 800 340 '#8b5cf6' 28
  Draw-Label $g $cfg.LowerLabel 800 790 '#8b5cf6' 28
  Draw-Label $g 'P' ($externalX + 18) ($externalY - 24) '#f97316' 28
  Save-Canvas $c $cfg.File
}

function Draw-ExternallyTangentCircles {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $c1x = 560; $c1y = 670; $r1 = 190
  $c2x = 980; $c2y = 670; $r2 = 230
  Draw-Circle $g $pens.pink $c1x $c1y $r1
  Draw-Circle $g $pens.blue $c2x $c2y $r2
  $g.DrawLine($pens.orange, $c1x, $c1y, $c2x, $c2y)
  Draw-Point $g $brushes.pink $c1x $c1y 16
  Draw-Point $g $brushes.blue $c2x $c2y 16
  Draw-Point $g $brushes.orange ($c1x + $r1) $c1y 14
  Draw-Label $g $cfg.LeftLabel 600 720 '#ec4899' 28
  Draw-Label $g $cfg.RightLabel 1030 720 '#4f46e5' 28
  Draw-Label $g $cfg.CenterLabel 760 610 '#f97316' 30
  Save-Canvas $c $cfg.File
}

function Draw-RegularHexagon {
  param($cfg)
  $c = New-Canvas
  $g = $c.Graphics
  Draw-Title $g $cfg.Title
  $cx = 730; $cy = 650; $r = 320
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
  Draw-Label $g $cfg.RadiusLabel 955 320 '#f97316' 28
  Draw-Label $g $cfg.SideLabel 930 395 '#8b5cf6' 28
  Save-Canvas $c $cfg.File
}

$configs = @(
  @{ File = 'q21.png'; Title = 'Angles in the Same Segment'; Type = 'same'; KnownLabel = '44 deg'; UnknownLabel = '?' },
  @{ File = 'q22.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '80 deg'; InscribedLabel = '?' },
  @{ File = 'q23.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '?'; InscribedLabel = '33 deg' },
  @{ File = 'q24.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = '72 deg'; UnknownLabel = '?' },
  @{ File = 'q25.png'; Title = 'Tangent and Radius'; Type = 'tangent'; AngleLabel = '?' },
  @{ File = 'q26.png'; Title = 'Angle in a Semicircle'; Type = 'semi'; AngleLabel = '?' },
  @{ File = 'q27.png'; Title = 'Perpendicular from the Centre'; Type = 'chord'; CenterLabel = 'O'; MeetLabel = 'M' },
  @{ File = 'q28.png'; Title = 'Equal Distance from the Centre'; Type = 'equalchords' },
  @{ File = 'q29.png'; Title = 'Tangents from an External Point'; Type = 'external'; UpperLabel = 'PA'; LowerLabel = 'PB' },
  @{ File = 'q30.png'; Title = 'Regular Hexagon in a Circle'; Type = 'hex'; RadiusLabel = 'radius'; SideLabel = 'side' },
  @{ File = 'q31.png'; Title = 'Angles in the Same Segment'; Type = 'same'; KnownLabel = '58 deg'; UnknownLabel = '?' },
  @{ File = 'q32.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = '95 deg'; UnknownLabel = '?' },
  @{ File = 'q33.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '146 deg'; InscribedLabel = '?' },
  @{ File = 'q34.png'; Title = 'Radius Perpendicular to Tangent'; Type = 'tangent'; AngleLabel = '90 deg' },
  @{ File = 'q35.png'; Title = 'Angle in a Semicircle'; Type = 'semi'; AngleLabel = '?' },
  @{ File = 'q36.png'; Title = 'Perpendicular from the Centre'; Type = 'chord'; CenterLabel = 'O'; MeetLabel = 'M' },
  @{ File = 'q37.png'; Title = 'Tangents from an External Point'; Type = 'external'; UpperLabel = 'PA = 7 cm'; LowerLabel = 'PB = ?' },
  @{ File = 'q38.png'; Title = 'Regular Hexagon in a Circle'; Type = 'hex'; RadiusLabel = 'radius = 6 cm'; SideLabel = 'side = ?' },
  @{ File = 'q39.png'; Title = 'Externally Tangent Circles'; Type = 'circles'; LeftLabel = '3 cm'; RightLabel = '5 cm'; CenterLabel = '?' },
  @{ File = 'q40.png'; Title = 'Angles in the Same Segment'; Type = 'same'; KnownLabel = 'x'; UnknownLabel = 'x' },

  @{ File = 'q41.png'; Title = 'Alternate Segment Theorem'; Type = 'same'; KnownLabel = '36 deg'; UnknownLabel = '?' },
  @{ File = 'q42.png'; Title = 'Alternate Segment Theorem'; Type = 'same'; KnownLabel = '28 deg'; UnknownLabel = '?' },
  @{ File = 'q43.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = '127 deg'; UnknownLabel = '?' },
  @{ File = 'q44.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '?'; InscribedLabel = '47 deg' },
  @{ File = 'q45.png'; Title = 'Equal Chords'; Type = 'equalchords' },
  @{ File = 'q46.png'; Title = 'Externally Tangent Circles'; Type = 'circles'; LeftLabel = '9 cm'; RightLabel = '?'; CenterLabel = '17 cm' },
  @{ File = 'q47.png'; Title = 'Tangents from an External Point'; Type = 'external'; UpperLabel = 'PA = 14 cm'; LowerLabel = 'PB = ?' },
  @{ File = 'q48.png'; Title = 'Regular Hexagon in a Circle'; Type = 'hex'; RadiusLabel = 'diameter = 20 cm'; SideLabel = 'side = ?' },
  @{ File = 'q49.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '?'; InscribedLabel = '62 deg' },
  @{ File = 'q50.png'; Title = 'Externally Tangent Circles'; Type = 'circles'; LeftLabel = '12 cm'; RightLabel = '15 cm'; CenterLabel = '?' },
  @{ File = 'q51.png'; Title = 'Alternate Segment Theorem'; Type = 'same'; KnownLabel = '63 deg'; UnknownLabel = '?' },
  @{ File = 'q52.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = '104 deg'; UnknownLabel = '?' },
  @{ File = 'q53.png'; Title = 'Tangents from an External Point'; Type = 'external'; UpperLabel = 'PA + PB = 18 cm'; LowerLabel = 'PA = PB' },
  @{ File = 'q54.png'; Title = 'Regular Hexagon in a Circle'; Type = 'hex'; RadiusLabel = 'radius = 11 cm'; SideLabel = 'side = ?' },
  @{ File = 'q55.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '134 deg'; InscribedLabel = '?' },
  @{ File = 'q56.png'; Title = 'Angles in the Same Segment'; Type = 'same'; KnownLabel = '71 deg'; UnknownLabel = '?' },
  @{ File = 'q57.png'; Title = 'Equal Chords'; Type = 'equalchords' },
  @{ File = 'q58.png'; Title = 'Angle in a Semicircle'; Type = 'semi'; AngleLabel = '?' },
  @{ File = 'q59.png'; Title = 'Radius and Tangent'; Type = 'tangent'; AngleLabel = '90 deg' },
  @{ File = 'q60.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = '138 deg'; UnknownLabel = '?' },

  @{ File = 'q61.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '?'; InscribedLabel = '24 deg' },
  @{ File = 'q62.png'; Title = 'Angles in the Same Segment'; Type = 'same'; KnownLabel = 'x'; UnknownLabel = 'x' },
  @{ File = 'q63.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = '109 deg'; UnknownLabel = '?' },
  @{ File = 'q64.png'; Title = 'Tangent and Radius'; Type = 'tangent'; AngleLabel = '90 deg' },
  @{ File = 'q65.png'; Title = 'Angle in a Semicircle'; Type = 'semi'; AngleLabel = '?' },
  @{ File = 'q66.png'; Title = 'Tangents from an External Point'; Type = 'external'; UpperLabel = 'PA = 9 cm'; LowerLabel = 'PB = ?' },
  @{ File = 'q67.png'; Title = 'Perpendicular from the Centre'; Type = 'chord'; CenterLabel = 'O'; MeetLabel = 'M' },
  @{ File = 'q68.png'; Title = 'Regular Hexagon in a Circle'; Type = 'hex'; RadiusLabel = 'radius = 4 cm'; SideLabel = 'perimeter = ?' },
  @{ File = 'q69.png'; Title = 'Externally Tangent Circles'; Type = 'circles'; LeftLabel = '2 cm'; RightLabel = '11 cm'; CenterLabel = '?' },
  @{ File = 'q70.png'; Title = 'Equal Chords'; Type = 'equalchords' },
  @{ File = 'q71.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '128 deg'; InscribedLabel = '?' },
  @{ File = 'q72.png'; Title = 'Angles in the Same Segment'; Type = 'same'; KnownLabel = '29 deg'; UnknownLabel = '?' },
  @{ File = 'q73.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = '88 deg'; UnknownLabel = '?' },
  @{ File = 'q74.png'; Title = 'Tangent and Radius'; Type = 'tangent'; AngleLabel = '90 deg' },
  @{ File = 'q75.png'; Title = 'Tangents from an External Point'; Type = 'external'; UpperLabel = 'PA + PB = 16 cm'; LowerLabel = 'PA = PB' },
  @{ File = 'q76.png'; Title = 'Circle Radius and Diameter'; Type = 'hex'; RadiusLabel = 'diameter = 18 cm'; SideLabel = 'radius = ?' },
  @{ File = 'q77.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '?'; InscribedLabel = '75 deg' },
  @{ File = 'q78.png'; Title = 'Regular Hexagon in a Circle'; Type = 'hex'; RadiusLabel = 'radius = ?'; SideLabel = 'side = 9 cm' },
  @{ File = 'q79.png'; Title = 'Externally Tangent Circles'; Type = 'circles'; LeftLabel = '6 cm'; RightLabel = '?'; CenterLabel = '14 cm' },
  @{ File = 'q80.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '150 deg'; InscribedLabel = '?' },

  @{ File = 'q81.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '3x'; InscribedLabel = 'x + 15 deg' },
  @{ File = 'q82.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = 'x + 20 deg'; UnknownLabel = '2x - 10 deg' },
  @{ File = 'q83.png'; Title = 'Tangents from an External Point'; Type = 'external'; UpperLabel = 'PA + PB = 30 cm'; LowerLabel = 'PA = PB' },
  @{ File = 'q84.png'; Title = 'Externally Tangent Circles'; Type = 'circles'; LeftLabel = '14 cm'; RightLabel = '?'; CenterLabel = '29 cm' },
  @{ File = 'q85.png'; Title = 'Regular Hexagon Perimeter'; Type = 'hex'; RadiusLabel = 'side = 12 cm'; SideLabel = 'perimeter = ?' },
  @{ File = 'q86.png'; Title = 'Regular Hexagon in a Circle'; Type = 'hex'; RadiusLabel = 'perimeter = 48 cm'; SideLabel = 'diameter = ?' },
  @{ File = 'q87.png'; Title = 'Angles in the Same Segment'; Type = 'same'; KnownLabel = 'x + 12 deg'; UnknownLabel = '2x - 6 deg' },
  @{ File = 'q88.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = 'x + 48 deg'; UnknownLabel = '2x + 6 deg' },
  @{ File = 'q89.png'; Title = 'Alternate Segment Theorem'; Type = 'same'; KnownLabel = '54 deg'; UnknownLabel = '?' },
  @{ File = 'q90.png'; Title = 'Equal Chords'; Type = 'equalchords' },
  @{ File = 'q91.png'; Title = 'Central and Inscribed Angles'; Type = 'central'; CentralLabel = '172 deg'; InscribedLabel = '?' },
  @{ File = 'q92.png'; Title = 'Angle in a Semicircle'; Type = 'semi'; AngleLabel = '90 deg' },
  @{ File = 'q93.png'; Title = 'Externally Tangent Circles'; Type = 'circles'; LeftLabel = '2k'; RightLabel = '3k'; CenterLabel = '25 cm' },
  @{ File = 'q94.png'; Title = 'Tangents from an External Point'; Type = 'external'; UpperLabel = 'PA = 2x + 1'; LowerLabel = 'PB = 17' },
  @{ File = 'q95.png'; Title = 'Regular Hexagon in a Circle'; Type = 'hex'; RadiusLabel = 'diameter = ?'; SideLabel = 'side = 7 cm' },
  @{ File = 'q96.png'; Title = 'Cyclic Quadrilateral'; Type = 'cyclic'; KnownLabel = '143 deg'; UnknownLabel = '?' },
  @{ File = 'q97.png'; Title = 'Regular Hexagon in a Circle'; Type = 'hex'; RadiusLabel = 'perimeter = 54 cm'; SideLabel = 'radius = ?' },
  @{ File = 'q98.png'; Title = 'Equal Chords'; Type = 'equalchords' },
  @{ File = 'q99.png'; Title = 'Angles in the Same Segment'; Type = 'same'; KnownLabel = '63 deg'; UnknownLabel = '?' },
  @{ File = 'q100.png'; Title = 'Externally Tangent Circles'; Type = 'circles'; LeftLabel = '10 cm'; RightLabel = '?'; CenterLabel = '23 cm' }
)

foreach ($cfg in $configs) {
  switch ($cfg.Type) {
    'same' { Draw-SameSegment $cfg }
    'central' { Draw-CentralInscribed $cfg }
    'cyclic' { Draw-CyclicQuad $cfg }
    'tangent' { Draw-TangentRadius $cfg }
    'semi' { Draw-DiameterSemicircle $cfg }
    'chord' { Draw-ChordMidpoint $cfg }
    'equalchords' { Draw-EqualChords $cfg }
    'external' { Draw-ExternalTangents $cfg }
    'circles' { Draw-ExternallyTangentCircles $cfg }
    'hex' { Draw-RegularHexagon $cfg }
  }
}

foreach ($pen in $pens.Values) { $pen.Dispose() }
foreach ($brush in $brushes.Values) { $brush.Dispose() }

Write-Output 'Generated q21.png through q100.png'
