$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$imagesDir = Join-Path $PSScriptRoot '..\images'
[System.IO.Directory]::CreateDirectory((Resolve-Path $imagesDir).Path) | Out-Null

function New-Canvas {
  param(
    [int]$Width = 1801,
    [int]$Height = 1263
  )

  $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::White)
  return @{ Bitmap = $bitmap; Graphics = $graphics; Width = $Width; Height = $Height }
}

function Save-Canvas {
  param(
    [hashtable]$Canvas,
    [string]$FileName
  )

  $path = Join-Path $imagesDir $FileName
  $Canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $Canvas.Graphics.Dispose()
  $Canvas.Bitmap.Dispose()
}

function New-Pen {
  param(
    [string]$Color,
    [float]$Width = 4
  )

  return New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($Color)), $Width
}

function New-Brush {
  param([string]$Color)
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($Color))
}

function Draw-Circle {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Pen]$Pen,
    [float]$CenterX,
    [float]$CenterY,
    [float]$Radius
  )

  $Graphics.DrawEllipse($Pen, $CenterX - $Radius, $CenterY - $Radius, $Radius * 2, $Radius * 2)
}

function Draw-Point {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Brush]$Brush,
    [float]$X,
    [float]$Y,
    [float]$Size = 14
  )

  $Graphics.FillEllipse($Brush, $X - ($Size / 2), $Y - ($Size / 2), $Size, $Size)
}

function Get-CirclePoint {
  param(
    [float]$CenterX,
    [float]$CenterY,
    [float]$Radius,
    [float]$Degrees
  )

  $radians = [Math]::PI * $Degrees / 180.0
  return [PSCustomObject]@{
    X = $CenterX + $Radius * [Math]::Cos($radians)
    Y = $CenterY - $Radius * [Math]::Sin($radians)
  }
}

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

  $font = New-Object System.Drawing.Font($FontName, $Size, [System.Drawing.FontStyle]::Regular)
  $brush = New-Brush $Color
  $Graphics.DrawString($Text, $font, $brush, $X, $Y)
  $brush.Dispose()
  $font.Dispose()
}

function Draw-Title {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text
  )

  Draw-Label -Graphics $Graphics -Text $Text -X 70 -Y 50 -Color '#0f172a' -Size 34
}

function Draw-AngleArc {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Pen]$Pen,
    [float]$X,
    [float]$Y,
    [float]$Radius,
    [float]$StartAngle,
    [float]$SweepAngle
  )

  $Graphics.DrawArc($Pen, $X - $Radius, $Y - $Radius, $Radius * 2, $Radius * 2, $StartAngle, $SweepAngle)
}

$blackPen = New-Pen '#1f2937' 4
$bluePen = New-Pen '#4f46e5' 5
$purplePen = New-Pen '#8b5cf6' 5
$pinkPen = New-Pen '#ec4899' 5
$greenPen = New-Pen '#16a34a' 5
$orangePen = New-Pen '#f97316' 5
$grayPen = New-Pen '#94a3b8' 3

$blueBrush = New-Brush '#4f46e5'
$purpleBrush = New-Brush '#8b5cf6'
$pinkBrush = New-Brush '#ec4899'
$greenBrush = New-Brush '#16a34a'
$orangeBrush = New-Brush '#f97316'
$darkBrush = New-Brush '#111827'
$lightBlueBrush = New-Brush '#dbeafe'
$lightPinkBrush = New-Brush '#fce7f3'
$lightGreenBrush = New-Brush '#dcfce7'

# q11: radius vs diameter
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Radius and Diameter'
$cx = 720; $cy = 650; $r = 340
Draw-Circle $g $blackPen $cx $cy $r
$left = Get-CirclePoint $cx $cy $r 180
$right = Get-CirclePoint $cx $cy $r 0
$topRight = Get-CirclePoint $cx $cy $r 35
$g.DrawLine($purplePen, $left.X, $left.Y, $right.X, $right.Y)
$g.DrawLine($bluePen, $cx, $cy, $topRight.X, $topRight.Y)
Draw-Point $g $darkBrush $cx $cy 16
Draw-Point $g $purpleBrush $left.X $left.Y 14
Draw-Point $g $purpleBrush $right.X $right.Y 14
Draw-Point $g $blueBrush $topRight.X $topRight.Y 14
Draw-Label $g 'diameter = 2r' 520 730 '#8b5cf6' 30
Draw-Label $g 'radius = r' 790 450 '#4f46e5' 30
Draw-Label $g 'O' ($cx + 18) ($cy - 40) '#111827' 28
Save-Canvas $c 'q11.png'

# q12: central vs inscribed angle
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Central Angle = 2 x Inscribed Angle'
$cx = 700; $cy = 660; $r = 360
Draw-Circle $g $blackPen $cx $cy $r
$a = Get-CirclePoint $cx $cy $r 150
$b = Get-CirclePoint $cx $cy $r 20
$p = Get-CirclePoint $cx $cy $r 240
$g.DrawLine($bluePen, $cx, $cy, $a.X, $a.Y)
$g.DrawLine($bluePen, $cx, $cy, $b.X, $b.Y)
$g.DrawLine($blackPen, $p.X, $p.Y, $a.X, $a.Y)
$g.DrawLine($blackPen, $p.X, $p.Y, $b.X, $b.Y)
Draw-AngleArc $g $orangePen $cx $cy 90 20 130
Draw-AngleArc $g $greenPen $p.X $p.Y 60 -20 -65
Draw-Point $g $darkBrush $cx $cy 16
Draw-Point $g $blueBrush $a.X $a.Y 14
Draw-Point $g $blueBrush $b.X $b.Y 14
Draw-Point $g $purpleBrush $p.X $p.Y 14
Draw-Label $g '110 deg' 760 525 '#f97316' 28
Draw-Label $g '55 deg' 355 760 '#16a34a' 28
Draw-Label $g 'O' ($cx + 18) ($cy - 38) '#111827' 28
Save-Canvas $c 'q12.png'

# q13: cyclic quadrilateral opposite angles
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Opposite Angles in a Cyclic Quadrilateral'
$cx = 760; $cy = 650; $r = 360
Draw-Circle $g $blackPen $cx $cy $r
$a = Get-CirclePoint $cx $cy $r 155
$b = Get-CirclePoint $cx $cy $r 35
$cpt = Get-CirclePoint $cx $cy $r 315
$d = Get-CirclePoint $cx $cy $r 225
$g.FillPolygon($lightBlueBrush, @(
  (New-Object System.Drawing.PointF($a.X, $a.Y)),
  (New-Object System.Drawing.PointF($b.X, $b.Y)),
  (New-Object System.Drawing.PointF($cpt.X, $cpt.Y)),
  (New-Object System.Drawing.PointF($d.X, $d.Y))
))
$g.DrawPolygon($purplePen, @(
  (New-Object System.Drawing.PointF($a.X, $a.Y)),
  (New-Object System.Drawing.PointF($b.X, $b.Y)),
  (New-Object System.Drawing.PointF($cpt.X, $cpt.Y)),
  (New-Object System.Drawing.PointF($d.X, $d.Y))
))
Draw-Point $g $purpleBrush $a.X $a.Y 14
Draw-Point $g $purpleBrush $b.X $b.Y 14
Draw-Point $g $purpleBrush $cpt.X $cpt.Y 14
Draw-Point $g $purpleBrush $d.X $d.Y 14
Draw-Label $g '68 deg' 420 430 '#ec4899' 30
Draw-Label $g '112 deg' 940 845 '#ec4899' 30
Draw-Label $g 'Opposite angles add to 180 deg' 930 180 '#0f172a' 28
Save-Canvas $c 'q13.png'

# q14: tangent perpendicular to radius
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Tangent Perpendicular to Radius'
$cx = 660; $cy = 650; $r = 300
Draw-Circle $g $bluePen $cx $cy $r
$touch = Get-CirclePoint $cx $cy $r 25
$g.DrawLine($orangePen, $touch.X - 500, $touch.Y + 230, $touch.X + 500, $touch.Y - 230)
$g.DrawLine($greenPen, $cx, $cy, $touch.X, $touch.Y)
$g.DrawRectangle($greenPen, $touch.X - 48, $touch.Y - 10, 44, 44)
Draw-Point $g $darkBrush $cx $cy 16
Draw-Point $g $orangeBrush $touch.X $touch.Y 16
Draw-Label $g '90 deg' ($touch.X - 20) ($touch.Y - 95) '#16a34a' 28
Draw-Label $g 'radius' 520 575 '#16a34a' 28
Draw-Label $g 'tangent' 1010 365 '#f97316' 28
Save-Canvas $c 'q14.png'

# q15: equal chords equal distance from centre
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Equal Distances from the Centre'
$cx = 720; $cy = 650; $r = 360
Draw-Circle $g $blackPen $cx $cy $r
$g.DrawLine($purplePen, $cx - 220, $cy - 150, $cx + 220, $cy - 150)
$g.DrawLine($purplePen, $cx - 220, $cy + 150, $cx + 220, $cy + 150)
$g.DrawLine($greenPen, $cx, $cy, $cx, $cy - 150)
$g.DrawLine($greenPen, $cx, $cy, $cx, $cy + 150)
$g.DrawRectangle($greenPen, $cx - 30, $cy - 180, 28, 28)
$g.DrawRectangle($greenPen, $cx - 30, $cy + 122, 28, 28)
Draw-Point $g $darkBrush $cx $cy 16
Draw-Label $g 'd' ($cx + 24) ($cy - 100) '#16a34a' 28
Draw-Label $g 'd' ($cx + 24) ($cy + 110) '#16a34a' 28
Draw-Label $g 'Chord 1' 980 420 '#8b5cf6' 28
Draw-Label $g 'Chord 2' 980 720 '#8b5cf6' 28
Draw-Label $g 'equal distance => equal chord length' 920 170 '#0f172a' 26
Save-Canvas $c 'q15.png'

# q16: alternate segment
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Alternate Segment Theorem'
$cx = 700; $cy = 690; $r = 330
Draw-Circle $g $bluePen $cx $cy $r
$t1 = Get-CirclePoint $cx $cy $r 115
$t2 = Get-CirclePoint $cx $cy $r 325
$p = Get-CirclePoint $cx $cy $r 20
$g.DrawLine($purplePen, $t1.X - 280, $t1.Y - 60, $t1.X + 420, $t1.Y + 90)
$g.DrawLine($orangePen, $t1.X, $t1.Y, $t2.X, $t2.Y)
$g.DrawLine($orangePen, $p.X, $p.Y, $t2.X, $t2.Y)
Draw-AngleArc $g $greenPen $t1.X $t1.Y 70 340 30
Draw-AngleArc $g $greenPen $p.X $p.Y 58 155 36
Draw-Point $g $purpleBrush $t1.X $t1.Y 14
Draw-Point $g $orangeBrush $t2.X $t2.Y 14
Draw-Point $g $darkBrush $p.X $p.Y 14
Draw-Label $g '41 deg' ($t1.X + 50) ($t1.Y - 55) '#16a34a' 28
Draw-Label $g '41 deg' ($p.X - 55) ($p.Y - 70) '#16a34a' 28
Save-Canvas $c 'q16.png'

# q17: externally tangent circles
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Externally Tangent Circles'
$c1x = 560; $c1y = 670; $r1 = 190
$c2x = 980; $c2y = 670; $r2 = 230
Draw-Circle $g $pinkPen $c1x $c1y $r1
Draw-Circle $g $bluePen $c2x $c2y $r2
$g.DrawLine($orangePen, $c1x, $c1y, $c2x, $c2y)
Draw-Point $g $pinkBrush $c1x $c1y 16
Draw-Point $g $blueBrush $c2x $c2y 16
Draw-Point $g $orangeBrush ($c1x + $r1) $c1y 14
Draw-Label $g '4 cm' 590 720 '#ec4899' 28
Draw-Label $g '9 cm' 1030 720 '#4f46e5' 28
Draw-Label $g 'centre distance = 4 + 9 = 13 cm' 990 180 '#0f172a' 28
Save-Canvas $c 'q17.png'

# q18: equal tangents from external point
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Tangents from One External Point'
$cx = 600; $cy = 650; $r = 230
Draw-Circle $g $bluePen $cx $cy $r
$externalX = 1230; $externalY = 610
$upper = Get-CirclePoint $cx $cy $r 120
$lower = Get-CirclePoint $cx $cy $r 302
$g.DrawLine($purplePen, $externalX, $externalY, $upper.X, $upper.Y)
$g.DrawLine($purplePen, $externalX, $externalY, $lower.X, $lower.Y)
$g.DrawLine($grayPen, $cx, $cy, $externalX, $externalY)
Draw-Point $g $orangeBrush $externalX $externalY 16
Draw-Point $g $purpleBrush $upper.X $upper.Y 14
Draw-Point $g $purpleBrush $lower.X $lower.Y 14
Draw-Label $g 'PA = 12 cm' 790 340 '#8b5cf6' 28
Draw-Label $g 'PB = 12 cm' 790 790 '#8b5cf6' 28
Draw-Label $g 'P' ($externalX + 16) ($externalY - 24) '#f97316' 28
Save-Canvas $c 'q18.png'

# q19: inscribed hexagon
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Regular Hexagon in a Circle'
$cx = 730; $cy = 650; $r = 320
Draw-Circle $g $bluePen $cx $cy $r
$points = @()
foreach ($deg in 90, 30, -30, -90, -150, 150) {
  $points += Get-CirclePoint $cx $cy $r $deg
}
$polygonPoints = $points | ForEach-Object { New-Object System.Drawing.PointF($_.X, $_.Y) }
$g.FillPolygon($lightGreenBrush, $polygonPoints)
$g.DrawPolygon($greenPen, $polygonPoints)
$g.DrawLine($orangePen, $cx, $cy, $points[0].X, $points[0].Y)
$g.DrawLine($purplePen, $points[0].X, $points[0].Y, $points[1].X, $points[1].Y)
Draw-Point $g $darkBrush $cx $cy 16
foreach ($pt in $points) { Draw-Point $g $greenBrush $pt.X $pt.Y 14 }
Draw-Label $g 'radius = 8 cm' 960 320 '#f97316' 28
Draw-Label $g 'side = 8 cm' 930 395 '#8b5cf6' 28
Save-Canvas $c 'q19.png'

# q20: hard cyclic quadrilateral
$c = New-Canvas
$g = $c.Graphics
Draw-Title $g 'Find the Opposite Angle'
$cx = 760; $cy = 655; $r = 355
Draw-Circle $g $blackPen $cx $cy $r
$a = Get-CirclePoint $cx $cy $r 145
$b = Get-CirclePoint $cx $cy $r 20
$c3 = Get-CirclePoint $cx $cy $r 300
$d = Get-CirclePoint $cx $cy $r 210
$g.FillPolygon($lightPinkBrush, @(
  (New-Object System.Drawing.PointF($a.X, $a.Y)),
  (New-Object System.Drawing.PointF($b.X, $b.Y)),
  (New-Object System.Drawing.PointF($c3.X, $c3.Y)),
  (New-Object System.Drawing.PointF($d.X, $d.Y))
))
$g.DrawPolygon($pinkPen, @(
  (New-Object System.Drawing.PointF($a.X, $a.Y)),
  (New-Object System.Drawing.PointF($b.X, $b.Y)),
  (New-Object System.Drawing.PointF($c3.X, $c3.Y)),
  (New-Object System.Drawing.PointF($d.X, $d.Y))
))
Draw-Point $g $pinkBrush $a.X $a.Y 14
Draw-Point $g $pinkBrush $b.X $b.Y 14
Draw-Point $g $pinkBrush $c3.X $c3.Y 14
Draw-Point $g $pinkBrush $d.X $d.Y 14
Draw-Label $g '97 deg' 465 410 '#ec4899' 30
Draw-Label $g 'x = 83 deg' 965 830 '#ec4899' 30
Draw-Label $g 'Opposite angles are supplementary' 915 180 '#0f172a' 28
Save-Canvas $c 'q20.png'

$pens = @($blackPen, $bluePen, $purplePen, $pinkPen, $greenPen, $orangePen, $grayPen)
$brushes = @($blueBrush, $purpleBrush, $pinkBrush, $greenBrush, $orangeBrush, $darkBrush, $lightBlueBrush, $lightPinkBrush, $lightGreenBrush)
foreach ($pen in $pens) { $pen.Dispose() }
foreach ($brush in $brushes) { $brush.Dispose() }

Write-Output 'Generated q11.png through q20.png'
