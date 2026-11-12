// ============================================================
//  OGGETTO DA RACCOGLIERE (Collectible)
//  Una reliquia, una moneta, un'offerta: sparisce quando il giocatore la prende.
//
//  DOVE SI METTE
//    Sul modello dell'oggetto (serve un Collider, il kit lo imposta come Trigger). Oppure usa PF_Kit_Reliquia / PF_Kit_Offerta.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Objective: obiettivo da far avanzare (facoltativo).
//    Item Name e Item Icon: se li riempi, l'oggetto va nell'inventario con quel nome e quell'icona. Vuoto = niente inventario.
//    Clip: suono di raccolta. Collect Vfx: effetto dove viene raccolto.
//    Animate: l'oggetto gira e ondeggia. Collect On Touch: si raccoglie toccandolo; spento serve un Interactable.
//
//  COME SI COLLEGA
//    On Collected: cosa succede quando viene raccolto.
//    Senza Collect On Touch: sullo stesso oggetto aggiungi un Interactable e collega On Interact > Collectible.Collect.
//
//  ESEMPIO
//    Item Name = "Lucerna": l'altare (ItemSocket) con Required Item Name = "Lucerna" la riconosce.
// ============================================================
using UnityEngine;
using UnityEngine.Events;

/// <summary>Oggetto da raccogliere (reliquia, moneta...): sparisce quando il giocatore lo tocca.</summary>
[RequireComponent(typeof(Collider))]
public class Collectible : MonoBehaviour
{
    [Tooltip("Obiettivo da far avanzare quando viene raccolto (es. \"Raccogli le reliquie\")")] public Objective objective;
    [Tooltip("Nome dell'oggetto che entra nell'inventario quando viene raccolto (facoltativo, es. Lucerna). Vuoto = niente inventario")] public string itemName;
    [Tooltip("Icona mostrata nell'inventario (128x128)")] public Sprite itemIcon;
    [Tooltip("Suono quando viene raccolto")] public AudioClip clip;
    [Tooltip("Effetto creato dove viene raccolto (facoltativo)")] public GameObject collectVfx;
    [Tooltip("Ruota e ondeggia per farsi notare")] public bool animate = true;
    [Tooltip("Se attivo si raccoglie toccandolo; se spento serve un Interactable (onInteract -> Collect) per raccoglierlo con E")] public bool collectOnTouch = true;
    [Tooltip("Cosa succede quando viene raccolto")] public UnityEvent onCollected = new UnityEvent();

    Vector3 start;

    void Reset() { GetComponent<Collider>().isTrigger = true; }
    void Start() { start = transform.position; }

    void Update()
    {
        if (!animate) return;
        transform.Rotate(0, 90 * Time.deltaTime, 0, Space.World);
        transform.position = start + Vector3.up * (0.15f * Mathf.Sin(Time.time * 2f));
    }

    void OnTriggerEnter(Collider other)
    {
        if (collectOnTouch && PlayerController.IsPlayer(other)) Collect();
    }

    /// <summary>Raccoglie l'oggetto. La chiama il trigger, oppure un Interactable.onInteract per raccogliere con E.</summary>
    public void Collect()
    {
        if (!string.IsNullOrEmpty(itemName))
        {
            if (!Inventory.Instance) { Debug.LogWarning("Per raccogliere un oggetto serve un Inventory in scena (prefab PF_Kit_GameManager).", this); return; }
            if (!Inventory.Instance.Add(new InventoryItem { name = itemName, icon = itemIcon })) return; // inventario pieno: l'oggetto resta qui
            GameManager.Instance?.ShowMessage("Hai raccolto: " + itemName);
        }
        if (collectVfx) { var v = Instantiate(collectVfx, transform.position, Quaternion.identity); Destroy(v, 3f); }
        KitAudio.Play(clip, transform.position);
        if (objective) objective.AddProgress();
        onCollected.Invoke();
        Destroy(gameObject);
    }
}
