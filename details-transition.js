// console.log(document.getElementsByName("details"));
// document.getElementsByTagName("details").forEach(details => {
//     const content = details.Q(".details-content");
//     console.log(hi);

//     details.addEventListener("toggle", () => {
//         if (details.open) {
//             console.log("hmm");
//             // OPEN animation
//             content.style.height = "0px";
//             const fullHeight = content.scrollHeight + "px";
//             requestAnimationFrame(() => {
//                 content.style.transition = "height 0.3s ease";
//                 content.style.height = fullHeight;
//             });
//             content.addEventListener("transitionend", () => {
//                 content.style.height = "auto";
//             }, { once: true });
//         } else {
//             // CLOSE animation
//             content.style.height = content.scrollHeight + "px";
//             requestAnimationFrame(() => {
//                 content.style.transition = "height 0.3s ease";
//                 content.style.height = "0px";
//             });
//         }
//     });
// });
