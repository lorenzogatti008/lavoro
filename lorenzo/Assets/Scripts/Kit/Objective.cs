// ============================================================
//  OBIETTIVO (Objective)
//  Un obiettivo del livello: compare nell'elenco in alto a sinistra e, quando tutti quelli obbligatori sono completi, si puo' vincere.
//
//  DOVE SI METTE
//    Su un oggetto vuoto: trascina il prefab PF_Kit_Obiettivo. Uno per ogni cosa da fare.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Description: il testo nell'elenco (es. "Accendi il braciere").
//    Required Count: quante volte va fatto (3 = tre reliquie).
//    Optional: spunta se NON serve per vincere.
//    Order: la posizione nell'elenco (il piu' basso e' in cima).
//
//  COME SI COLLEGA
//    Si fa avanzare scrivendolo nel campo Objective di un altro pezzo del kit
//    (Interactable, Collectible, PressurePlate, TriggerZone, ItemSocket).
//    On Completed: cosa succede quando e' completo (es. aprire una porta).
//
//  ESEMPIO
//    Description = "Raccogli le reliquie", Required Count = 3. Ogni reliquia ha questo obiettivo nel suo campo Objective.
// ============================================================
using UnityEngine;
using UnityEngine.Events;

/// <summary>
/// Un obiettivo del livello. Il GameManager li trova da solo, li elenca nell'HUD
/// e fa vincere quando tutti quelli obbligatori sono completi.
/// Si fa avanzare collegandolo al campo "Objective" di un altro componente del kit
/// (Interactable, Collectible, PressurePlate, TriggerZone) oppure da un UnityEvent.
/// </summary>
public class Objective : MonoBehaviour
{
    [Tooltip("Testo mostrato nell'elenco degli obiettivi")] public string description = "Nuovo obiettivo";
    [Tooltip("Quante volte va fatto (es. 3 reliquie). 1 = basta una volta")] [Min(1)] public int requiredCount = 1;
    [Tooltip("Se attivo, non serve per vincere")] public bool optional;
    [Tooltip("Posizione nell'elenco: i numeri piu' bassi vengono prima")] public int order;
    [Tooltip("Cosa succede quando l'obiettivo e' completo (es. aprire una porta)")] public UnityEvent onCompleted = new UnityEvent();

    int count;
    public int Count => count;
    public bool IsComplete => count >= requiredCount;

    /// <summary>Fa un passo avanti (es. una reliquia raccolta).</summary>
    public void AddProgress()
    {
        if (IsComplete) return;
        count++;
        Changed();
    }

    /// <summary>Completa subito l'obiettivo, qualunque sia il contatore.</summary>
    public void Complete()
    {
        if (IsComplete) return;
        count = requiredCount;
        Changed();
    }

    void Changed()
    {
        if (IsComplete) onCompleted.Invoke();
        GameManager.Instance?.Refresh();
    }
}
