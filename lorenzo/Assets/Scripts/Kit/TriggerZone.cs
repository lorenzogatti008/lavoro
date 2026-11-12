// ============================================================
//  ZONA INVISIBILE (TriggerZone)
//  Fa qualcosa quando il giocatore entra in una zona o ne esce.
//
//  DOVE SI METTE
//    Trascina PF_Kit_ZonaTrigger e ridimensionala. Nella Scene si vede come un box azzurro.
//
//  COSA CONFIGURARE (nell'Inspector)
//    One Shot: scatta solo la prima volta.
//    Objective: obiettivo da far avanzare quando entri (facoltativo).
//    Message: un messaggio a schermo quando entri (facoltativo).
//
//  COME SI COLLEGA
//    On Player Enter / On Player Exit: cosa succede quando il giocatore entra o esce.
//
//  ESEMPIO
//    Message = "Senti un rumore dalla stanza", On Player Enter > Porta > Door.Open.
// ============================================================
using UnityEngine;
using UnityEngine.Events;

/// <summary>Zona invisibile: fa qualcosa quando il giocatore ci entra o ne esce.</summary>
[RequireComponent(typeof(Collider))]
public class TriggerZone : MonoBehaviour
{
    [Tooltip("Se attivo, scatta solo la prima volta che il giocatore entra")] public bool oneShot = true;
    [Tooltip("Obiettivo da far avanzare quando il giocatore entra (facoltativo)")] public Objective objective;
    [Tooltip("Messaggio mostrato a schermo quando il giocatore entra (facoltativo)")] [TextArea] public string message;
    [Tooltip("Cosa succede quando il giocatore entra")] public UnityEvent onPlayerEnter = new UnityEvent();
    [Tooltip("Cosa succede quando il giocatore esce")] public UnityEvent onPlayerExit = new UnityEvent();

    bool done;

    void Reset() { GetComponent<Collider>().isTrigger = true; }

    void OnTriggerEnter(Collider other)
    {
        if (!PlayerController.IsPlayer(other) || (oneShot && done)) return;
        done = true;
        if (objective) objective.AddProgress();
        if (!string.IsNullOrEmpty(message)) GameManager.Instance?.ShowMessage(message);
        onPlayerEnter.Invoke();
    }

    void OnTriggerExit(Collider other)
    {
        if (PlayerController.IsPlayer(other)) onPlayerExit.Invoke();
    }

    void OnDrawGizmos() { KitGizmos.DrawZone(GetComponent<Collider>(), new Color(0.2f, 0.8f, 1f, 0.25f)); }
}
