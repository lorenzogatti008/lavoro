// ============================================================
//  ALTARE PER UN OGGETTO (ItemSocket)
//  Un punto dove posare un oggetto dell'inventario (es. la lucerna sull'altare).
//
//  DOVE SI METTE
//    Sullo stesso oggetto di un Interactable, oppure trascina PF_Kit_Altare.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Required Item Name: il nome dell'oggetto richiesto, scritto UGUALE a quello del Collectible (es. Lucerna).
//    Consume Item: l'oggetto esce dall'inventario quando lo posi.
//    Placed Visual: un oggetto che compare quando e' posato (es. la lucerna sull'altare).
//    Objective, Missing Message (il testo se manca l'oggetto), Place Sound.
//
//  COME SI COLLEGA
//    Nell'Interactable: On Interact > + > questo oggetto > ItemSocket > TryPlace.
//    On Placed: cosa succede quando l'oggetto e' posato (es. Door.Open).
//
//  ESEMPIO
//    Required Item Name = "Lucerna", On Placed > Door.Open.
// ============================================================
using UnityEngine;
using UnityEngine.Events;

/// <summary>Punto dove posare un oggetto (es. l'altare per l'offerta). Collega Interactable.onInteract -> ItemSocket.TryPlace.</summary>
public class ItemSocket : MonoBehaviour
{
    [Tooltip("Nome dell'oggetto che va posato qui (lo stesso scritto sul Collectible, es. Lucerna)")] public string requiredItemName;
    [Tooltip("Se attivo, l'oggetto esce dall'inventario quando viene posato")] public bool consumeItem = true;
    [Tooltip("Oggetto che compare quando l'offerta e' posata (es. la lucerna sull'altare)")] public GameObject placedVisual;
    [Tooltip("Obiettivo da far avanzare quando l'oggetto e' posato (facoltativo)")] public Objective objective;
    [Tooltip("Messaggio quando il giocatore non ha l'oggetto. {0} = nome dell'oggetto")] public string missingMessage = "Ti serve: {0}";
    [Tooltip("Suono quando l'oggetto viene posato")] public AudioClip placeSound;
    [Tooltip("Cosa succede quando l'oggetto e' posato (es. Door.Open)")] public UnityEvent onPlaced = new UnityEvent();

    bool placed;
    public bool IsPlaced => placed;

    void Awake() { if (placedVisual) placedVisual.SetActive(false); }

    /// <summary>Prova a posare l'oggetto richiesto. Collegalo a Interactable.onInteract.</summary>
    public void TryPlace()
    {
        if (placed) return;
        if (string.IsNullOrEmpty(requiredItemName)) { Debug.LogWarning("ItemSocket senza Required Item Name: scrivi il nome dell'oggetto da posare.", this); return; }
        var inv = Inventory.Instance;
        if (!inv || !inv.Has(requiredItemName)) { GameManager.Instance?.ShowMessage(string.Format(missingMessage, requiredItemName)); return; }

        if (consumeItem) inv.Remove(requiredItemName);
        placed = true;
        if (placedVisual) placedVisual.SetActive(true);
        var interactable = GetComponent<Interactable>(); if (interactable) interactable.enabled = false; // niente piu' prompt
        KitAudio.Play(placeSound, transform.position);
        if (objective) objective.AddProgress();
        onPlaced.Invoke();
    }
}
