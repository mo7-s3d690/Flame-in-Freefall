// Mission setup interactions. This stores user inputs only; analysis is provided by the API/dashboard.
(() => {
  const $ = id => document.getElementById(id);
  const controls = { o2: $("o2"), pressure: $("pressure"), flow: $("flow") };
  const presets = {
    suit: { o2: 100, pressure: 4.3, flow: 0 },
    earth: { o2: 21, pressure: 14.7, flow: 20 },
    moon: { o2: 30, pressure: 10.2, flow: 20 }
  };
  let gravity = "microgravity";
  const update = () => {
    $("o2-value").textContent = `${controls.o2.value}%`;
    $("pressure-value").textContent = `${Number(controls.pressure.value).toFixed(1)} PSI`;
    $("flow-value").textContent = `${controls.flow.value} cm/s`;
  };
  Object.values(controls).forEach(input => input.addEventListener("input", () => {
    update();
    document.querySelectorAll(".preset").forEach(b => b.classList.toggle("selected", b.dataset.preset === "custom"));
  }));
  document.querySelectorAll(".preset").forEach(button => button.addEventListener("click", () => {
    const preset = button.dataset.preset;
    document.querySelectorAll(".preset").forEach(b => b.classList.toggle("selected", b === button));
    if (presets[preset]) Object.entries(presets[preset]).forEach(([key, value]) => controls[key].value = value);
    update();
  }));
  $("gravity-options").querySelectorAll(".choice").forEach(button => button.addEventListener("click", () => {
    gravity = button.dataset.value;
    $("gravity-options").querySelectorAll(".choice").forEach(b => b.classList.toggle("active", b === button));
  }));
  $("analyze").addEventListener("click", () => {
    const env = {
      o2: Number(controls.o2.value),
      pressure: Number(controls.pressure.value),
      flow: Number(controls.flow.value),
      gravity,
      material: $("material").value,
      diluent: $("diluent").value
    };
    try { sessionStorage.setItem("ignite.env", JSON.stringify(env)); } catch {}
    window.location.href = "dashboard.html";
  });
  update();
})();
