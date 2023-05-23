export function getParams(param:any) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(param) || '0';
}

