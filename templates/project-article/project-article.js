export default async function decorate() {
  try {
    const projectURL = window.location.pathname;
    const language = window.location.pathname.split('/')[1];
    let url;
    if (language === 'en') {
        url = 'https://main--fondationsaudemarspiguet--aemdemos.aem.page/en/fondation-pour-les-arbres-projects/projects-index.json';
    } else if(language === 'fr') {
        url = 'https://main--fondationsaudemarspiguet--aemdemos.aem.page/fr/fondation-pour-les-arbres-nos-projets/projects-index.json';
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const projectdata = data.data;
    const matchedData = projectdata.find(item =>
      item.path.toLowerCase() === projectURL.toLowerCase()
    );
    if (matchedData) {
      const sidebar = document.createElement('div');
      sidebar.className = 'project-article-sidebar';
      if (language === 'en') {
        sidebar.innerHTML = `
          <div> partner </div>
            ${matchedData.partner}
          <div> Categories </div>
            ${matchedData.category}
          <div>Project Duration </div>
            ${matchedData.duration}
          <div> Location </div>
            ${matchedData.location}
          <div> Links </div>
            <a href="${matchedData.links}"</a>
          <div> Photos </div>
            ${matchedData.photos}
          `;
      } else if (language === 'fr') {
        sidebar.innerHTML = `
          <div> partenaire </div>
            ${matchedData.partner}
          <div> Catégories </div>
            ${matchedData.category}
          <div> Durée du projet </div>
            ${matchedData.duration}
          <div> Emplacement </div>
            ${matchedData.location}
          <div> Liens </div>
            <a href="${matchedData.links}"</a>
          <div> Photos </div>
            ${matchedData.photos}
        `;
      }
      const projectDiv = document.querySelector('.project-article-template .details-sidebar');
      const articleContent = projectDiv.querySelector('.default-content-wrapper');
      projectDiv.insertBefore(sidebar, articleContent);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
