// function injectScript() {
//     try {

//         // Create script element to inject provider code
//         const script = document.createElement('script');
//         script.src = chrome.runtime.getURL('provider.js');
//         script.type = 'text/javascript';

//         // Add load event listener to verify injection
//         script.onload = () => {
//             console.log('Provider script injected successfully');
//         };

//         // Inject at document start
//         (document.head || document.documentElement).appendChild(script);
//     } catch (error) {
//         console.error('Failed to inject provider:', error);
//     }
// }

// // Execute injection
// injectScript();

(function () {

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('provider.js');
    script.type = 'text/javascript';
    script.onload = () => {
        console.log('Provider script injected successfully');
    };

    (document.head || document.documentElement).appendChild(script);
})();


window.addEventListener("message", (event) => {
    if (event.source !== window) return; // Ignore other iframes

    const message = event.data;
    if (message && message.type === "vaultx-dapp-request") {
        chrome.runtime.sendMessage({message}, (response) => {
            console.log(response);
            window.postMessage({ type: "vaultx-dapp-response", response: response.result, error: response.error }, "*");
        });
    }
    
});
