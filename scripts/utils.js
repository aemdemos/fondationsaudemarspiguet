export default function getPathSegments() {
  return window.location.pathname.split('/')
    .filter((segment) => segment);
}
