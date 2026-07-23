param(
    [string]$BaseUrl = "http://127.0.0.1:8000"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$routes = @(
    "/",
    "/collections",
    "/search",
    "/cart",
    "/checkout",
    "/wishlist",
    "/about",
    "/contact",
    "/track-order",
    "/faq",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/admin/login"
)

$results = foreach ($route in $routes) {
    $url = "$BaseUrl$route"
    try {
        $resp = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 20
        [PSCustomObject]@{ Status = $resp.StatusCode; Route = $route }
    }
    catch {
        $statusCode = "ERR"
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }
        [PSCustomObject]@{ Status = $statusCode; Route = $route }
    }
}

$results | Format-Table -AutoSize

$nonOk = @($results | Where-Object { $_.Status -ne 200 })
if ($nonOk.Count -gt 0) {
    Write-Host "\nNon-200 routes:" -ForegroundColor Yellow
    $nonOk | Format-Table -AutoSize
} else {
    Write-Host "\nAll smoke-test routes returned 200." -ForegroundColor Green
}
