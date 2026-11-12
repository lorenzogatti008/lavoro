// ============================================================
//  INVENTARIO (Inventory)
//  Tiene gli oggetti raccolti (fino a 4) e li mostra in basso a sinistra.
//
//  DOVE SI METTE
//    E' gia' dentro il prefab PF_Kit_GameManager: non va aggiunto a mano. Ne serve uno per scena.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Capacity: quanti oggetti si possono tenere.
//    Full Message: il messaggio quando e' pieno.
//
//  COME SI COLLEGA
//    On Changed: cosa succede quando un oggetto entra o esce.
//    Gli oggetti ci entrano dal Collectible (campo Item Name).
//
//  ESEMPIO
//    Non devi fare niente: raccogli un Collectible con Item Name e compare l'icona.
// ============================================================
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

/// <summary>Un oggetto nell'inventario: un nome e un'icona. Lo crea il Collectible quando viene raccolto.</summary>
public class InventoryItem
{
    public string name; public Sprite icon;
}

/// <summary>Inventario minimo: fino a 4 oggetti, mostrati nell'HUD. Sta nel prefab PF_Kit_GameManager.</summary>
public class Inventory : MonoBehaviour
{
    public static Inventory Instance { get; private set; }

    [Tooltip("Quanti oggetti si possono tenere")] [Min(1)] public int capacity = 4;
    [Tooltip("Messaggio quando l'inventario e' pieno")] public string fullMessage = "Hai le mani piene";
    [Tooltip("Chiamato quando un oggetto entra o esce")] public UnityEvent onChanged = new UnityEvent();

    readonly List<InventoryItem> items = new List<InventoryItem>();

    public int Count => items.Count;
    public IReadOnlyList<InventoryItem> Items => items;

    void Awake()
    {
        if (Instance && Instance != this) Debug.LogWarning("Ci sono due Inventory nella scena: ne serve uno solo.", this);
        Instance = this;
    }

    void OnDestroy() { if (Instance == this) Instance = null; }

    /// <summary>Vero se nell'inventario c'e' un oggetto con questo nome.</summary>
    public bool Has(string itemName) => !string.IsNullOrEmpty(itemName) && items.Exists(i => i.name == itemName);

    /// <summary>Aggiunge un oggetto. Restituisce false (e avvisa) se l'inventario e' pieno.</summary>
    public bool Add(InventoryItem item)
    {
        if (item == null) return false;
        if (items.Count >= capacity) { GameManager.Instance?.ShowMessage(fullMessage); return false; }
        items.Add(item);
        onChanged.Invoke();
        return true;
    }

    /// <summary>Toglie l'oggetto con questo nome. Restituisce false se non c'e'.</summary>
    public bool Remove(string itemName)
    {
        var i = items.Find(x => x.name == itemName);
        if (i == null || !items.Remove(i)) return false;
        onChanged.Invoke();
        return true;
    }
}
