let schemaJSON = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": "Universität Trier",
    "url": "https://www.uni-trier.de/",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Universitätsring 15",
        "addressLocality": "Trier",
        "postalCode": "54296",
        "addressCountry": "Deutschland"
    },
    "telephone": "+49 651 201-0",
    "email": "info@uni-trier.de",
    "sameAs": [
        "https://www.facebook.com/uni.trier",
        "http://www.twitter.com/trieruni",
        "https://www.instagram.com/uni_trier/",
        "https://www.linkedin.com/school/trieruni/",
        "https://www.youtube.com/unitrier"
    ]
}

function add_educational_program(schemaJSON) {

    if (document.getElementById("studiengang") === null) {
        console.log("keine Studiengangseite");
        return schemaJSON;
    }

    const studiengang = document.getElementById("studiengang").textContent.trim();
    const abschluss = document.getElementById("abschluss").textContent.trim().split('|').map(item => item.trim());
    const art = document.getElementById("art").textContent.trim().split('|').map(item => item.trim());
    const regelstudienzeit = document.getElementById("regelstudienzeit").textContent.trim();
    const ects = document.getElementById("ects").textContent.trim().split('|').map(item => item.trim());
    const zulassungsbeschraenkung = document.getElementById("zulassungsbeschraenkung").textContent.trim().split('|').map(item => item.trim());
    const studienbeginn = document.getElementById("studienbeginn").textContent.trim().split('|').map(item => item.trim());
    const bewerbungsfrist = document.getElementById("bewerbungsfrist").textContent.trim().split('|').map(item => item.trim());
    const unterrichtssprache = document.getElementById("unterrichtssprache").textContent.trim();

    const studieninfo =
        {
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalProgram",
            "name": studiengang,
            "educationalCredentialAwarded": abschluss,
            "programType": art,
            "termDuration": parseInt(regelstudienzeit.split(" ")[0]),
            "termsPerYear": 2,
            "programPrerequisites": zulassungsbeschraenkung,
            "numberOfCredits": ects.map(item => {
                let [credits, type] = item.split('im');
                return parseInt(credits.trim())
            }),
            "educationalProgramMode": "Full-time",
            "startDate": studienbeginn.map(item => item === "Wintersemester" ? "2024-10-01" : "2025-04-01"),
            "applicationDeadline": bewerbungsfrist.map(date => date.trim() === "15. September" ? "2024-09-15" : "2025-03-15"),
            "provider": schemaJSON
        };
    return studieninfo
}


schemaJSON = add_educational_program(schemaJSON);
const script = document.createElement('script');
script.type = 'application/ld+json';
script.text = JSON.stringify(schemaJSON);
document.head.appendChild(script);
