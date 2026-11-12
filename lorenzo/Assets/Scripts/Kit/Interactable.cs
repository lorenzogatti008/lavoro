// ============================================================
//  OGGETTO INTERATTIVO (Interactable)
//  Rende un oggetto utilizzabile con il tasto E quando il giocatore e' vicino.
//
//  DOVE SI METTE
//    Su qualsiasi oggetto (serve un Collider). Il prompt compare sullo schermo.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Prompt: il testo mostrato (es. "Leggi la scheda").
//    One Shot: spunta se si puo' usare una volta sola.
//    Objective: un obiettivo da far avanzare quando lo usi (facoltativo).
//    Sound: suono quando lo usi (facoltativo).
//
//  COME SI COLLEGA
//    On Interact: la lista di cosa succede quando premi E.
//    Premi +, trascina un oggetto e scegli cosa fare (es. InfoPoint > Toggle).
//
//  ESEMPIO
//    Su un cippo: Prompt = "Leggi la scheda", On Interact > InfoPoint.Toggle.
// ============================================================
using UnityEngine;
using UnityEngine.Events;

/// <summary>Oggetto con cui si interagisce premendo E quando si e' vicini.</summary>
public class Interactable : MonoBehaviour
{
    [Tooltip("Testo mostrato quando il giocatore e' vicino")] public string prompt = "Interagisci";
    [Tooltip("Se attivo, si puo' usare una sola volta")] public bool oneShot;
    [Tooltip("Obiettivo da far avanzare quando lo usi (facoltativo)")] public Objective objective;
    [Tooltip("Suono quando lo usi (facoltativo)")] public AudioClip sound;
    [Tooltip("Cosa succede quando il giocatore preme E")] public UnityEvent onInteract = new UnityEvent();

    bool used;
    public bool CanUse => isActiveAndEnabled && !(oneShot && used);

    public void Use()
    {
        if (!CanUse) return;
        used = true;
        KitAudio.Play(sound, transform.position);
        if (objective) objective.AddProgress();
        onInteract.Invoke();
    }

    /// <summary>Rende di nuovo usabile un oggetto oneShot (es. un braciere che si e' spento).</summary>
    public void ResetUse() { used = false; }
}
