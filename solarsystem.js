
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('fond.jpg', function(texture) {
        scene.background = texture;  // Appliquer la texture comme fond
    });
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    var sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    var sunTexture = textureLoader.load('sun.jpg');
    var sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    var sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    function createPlanet(size, color, distanceFromSun, texturePath) {
        var geometry = new THREE.SphereGeometry(size, 32, 32);
        var material = texturePath ? new THREE.MeshBasicMaterial({ map: textureLoader.load(texturePath) }) : new THREE.MeshBasicMaterial({ color: color });
        var planet = new THREE.Mesh(geometry, material);
        planet.position.x = distanceFromSun;
        scene.add(planet);
        return planet;
    }

    var mercury = createPlanet(1.5, 0xaaaaaa, 13, 'mercure.jpg');
    var venus = createPlanet(3, 0xffd700, 18, 'venus.jpg');
    var earth = createPlanet(4, 0x0000ff, 30, 'earth.jpg');
    var mars = createPlanet(2, 0x0000ff, 50, 'mars.jpg');
    var jupiter = createPlanet(2, 0x0000ff, 80, 'jupiter.jpg');

    function addOrbit(distanceFromSun, color) {
        var orbitShape = new THREE.EllipseCurve(
            0, 0,
            distanceFromSun, distanceFromSun,
            0, 2 * Math.PI,
            false,
            0
        );

        var points = orbitShape.getPoints(100);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineDashedMaterial({
            color: color,
            dashSize: 1,    // Length of the dash
            gapSize: 1,     // Length of the gap
            scale: 1        // The scale of the dashed pattern
            
        });        
        var orbit = new THREE.Line(geometry, material);
        orbit.computeLineDistances();
        orbit.rotation.x = Math.PI / 2;

        scene.add(orbit);
    }

    addOrbit(13, 0xaaaaaa);
    addOrbit(18, 0xaaaaaa);
    addOrbit(30, 0xaaaaaa);
    addOrbit(50, 0xaaaaaa);
    addOrbit(80, 0xaaaaaa);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;

    function animate() {
        requestAnimationFrame(animate);
        var timeInSeconds = Date.now() * 0.001;

        mercury.position.x = 13 * Math.cos(timeInSeconds * 1);
        mercury.position.z = 13 * Math.sin(timeInSeconds * 1);
        venus.position.x = 18 * Math.cos(timeInSeconds * 0.08);
        venus.position.z = 18 * Math.sin(timeInSeconds * 0.08);
        earth.position.x = 30 * Math.cos(timeInSeconds * 0.2);
        earth.position.z = 30 * Math.sin(timeInSeconds * 0.2);
        mars.position.x = 50 * Math.cos(timeInSeconds * 0.1);
        mars.position.z = 50 * Math.sin(timeInSeconds * 0.1);
        jupiter.position.x = 80 * Math.cos(timeInSeconds * 0.02);
        jupiter.position.z = 80 * Math.sin(timeInSeconds * 0.02);

        renderer.render(scene, camera);
        controls.update();
    }

    camera.position.set(100, 50, 100);
    camera.translateZ(-50);
    controls.maxDistance = 1000; // Augmentez selon le besoin
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    animate();
